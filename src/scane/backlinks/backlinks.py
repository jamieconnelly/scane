import logging
import os
from datetime import datetime
from glob import glob
from time import sleep

from django.conf import settings
import pandas as pd
from scane.mails import mails
from selenium.webdriver.chrome.options import Options
from splinter import Browser


logger = logging.getLogger(__name__)


def get_browser():
    options = Options()
    options.add_experimental_option(
        'prefs', {'download.default_directory': settings.CHROME_DOWNLOADS_DIR}
    )
    browser = Browser('chrome', headless=settings.USE_HEADLESS_CHROME, options=options)

    if settings.USE_HEADLESS_CHROME:
        # Some extra work is needed in order to enable downloads on when the headless flag is set
        # https://github.com/TheBrainFamily/chimpy/issues/108#issuecomment-406796688
        browser.driver.command_executor._commands['send_command'] = (
            'POST',
            '/session/$sessionId/chromium/send_command',
        )
        browser.driver.execute(
            'send_command',
            {
                'cmd': 'Page.setDownloadBehavior',
                'params': {
                    'behavior': 'allow',
                    'downloadPath': settings.CHROME_DOWNLOADS_DIR,
                },
            },
        )

    return browser


def concatenate_files(files):
    df_list = []
    for file in files:
        try:
            df = pd.read_csv(file, encoding='utf-8')
            df_list.append(df)
        except UnicodeDecodeError:
            df = pd.read_csv(file, encoding='utf-16')
            df_list.append(df)
        except UnicodeError:
            logger.error(f'Corrupt file: {file}')
            continue

    return pd.concat(df_list)


def make_aggregate_file(downloaded_files, input_file_name):
    # `Clean` merged __topic__ file
    df = concatenate_files(downloaded_files)
    df = df.sort_values('Domain Rating')
    df = df[['Referring Page URL', 'Link URL', 'Type', 'Language']]
    df = df[(df['Language'] == 'en') | (df['Language'].isnull())]
    df = df[df['Type'] != 'Nofollow']

    if not os.path.exists(settings.EXPORTS_DIR):
        os.makedirs(settings.EXPORTS_DIR)

    date = datetime.today().strftime('%Y%m%d')
    output_file_name = f'{date}_{input_file_name}_backlinks'

    # Write excel file
    excel_file_path = os.path.join(settings.EXPORTS_DIR, f'{output_file_name}.xlsx')
    writer = pd.ExcelWriter(
        excel_file_path, engine='xlsxwriter', options={'strings_to_urls': False}
    )
    df.to_excel(writer, index=False, encoding='utf-8')
    writer.save()
    logger.info(f'created excel for: {input_file_name}')

    # Write `Referring Page URL's` to text file
    df = df[['Referring Page URL']]
    raw_txt_path = os.path.join(settings.EXPORTS_DIR, f'{output_file_name}_RAW.txt')
    df.to_csv(raw_txt_path, header=None, index=False, encoding='utf-8')
    logger.info(f'created RAW txt file for: {input_file_name}')


def login(browser):
    browser.visit('https://ahrefs.com/user/login')
    # There may be a cookie banner which we need to close to reveal
    # the login button. If its not there just continue
    if browser.is_element_present_by_css('.iubenda-cs-close-btn', wait_time=3):
        browser.find_by_css('.iubenda-cs-close-btn').first.click()

    browser.find_by_css('input[name=email]').first.fill(settings.AHREFS_EMAIL)
    browser.find_by_css('input[name=password]').first.fill(settings.AHREFS_PASSWORD)
    browser.find_by_css('input[type=submit]').first.click()
    browser.is_element_present_by_text('Dashboard', wait_time=3)
    logger.info('Signed into ahrefs')


def export_link_data(browser):
    browser.find_by_id('export_button').first.click()
    sleep(1)

    if browser.find_by_id('CSVExportModalDialog').first.visible:
        browser.find_by_id('start_full_export').first.click()
        browser.find_by_id('start_export_button').first.click()


def clear_file_dropdown(browser):
    browser.find_by_id('removeAllExportedFiles').first.click()
    browser.is_element_present_by_id('Remove', wait_time=3)
    browser.find_by_text('Remove').first.click()


def open_notifications(browser):
    # Click the __tray__ icon in the menu bar then click all the
    # `a` tags in order to download them
    browser.find_by_id('top_notifications').mouse_over()
    browser.find_by_id('top_notifications').first.click()


def download_files(browser):
    # Hack to removing blocking notification that is sometimes there
    browser.reload()

    open_notifications(browser)

    # Wait for all exports to be finished processing
    total_wait_time = 0
    should_wait = browser.is_text_present('processing')
    while should_wait:
        if total_wait_time >= 5 * 12 * 10:
            # Some exports hang so wait a max of 10 mins
            should_wait = False
        else:
            should_wait = browser.is_text_present('processing')
            if should_wait:
                total_wait_time += 5
                sleep(5)

    a_tags = browser.find_by_css('a[name=link_to_download]')
    for a_tag in a_tags:
        a_tag.click()


def get_backlinks(data):
    browser = get_browser()

    login(browser)
    # Make sure there are no notifications before starting
    open_notifications(browser)
    clear_file_dropdown(browser)

    for i, file in enumerate(data):
        file_name = list(file.keys())[0]
        logger.info(f'processing file: {file_name}')

        for j, target_url in enumerate(file[file_name]):
            logger.info(f'processing target_url: {target_url}')

            browser.visit(
                f'https://ahrefs.com/site-explorer/backlinks/v7/external-similar-links/subdomains/live/en/all/dofollow/1/ahrefs_rank_desc?target={target_url}'
            )
            export_link_data(browser)

            # Export 100 files, download them, clean up, continue
            if j > 0 and j % 100 == 0:
                logger.info(f'downloading batch: {j + 1}')
                download_files(browser)
                clear_file_dropdown(browser)

        # Download any of the leftovers
        download_files(browser)
        clear_file_dropdown(browser)

        # Explicit sleep to ensure all files are downloaded
        sleep(60 * 10)
        downloaded_files = glob(f'{settings.CHROME_DOWNLOADS_DIR}/*.csv')
        if len(downloaded_files) > 0:
            make_aggregate_file(downloaded_files, file_name)

            # Remove all files from the downloads dir
            for f in downloaded_files:
                os.remove(f)

    mails.send_export_email()
