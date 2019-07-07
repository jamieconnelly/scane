import logging
from time import sleep

from django.conf import settings
from splinter import Browser

# from merge_files import concatenate_and_clean


logger = logging.getLogger(__name__)


def login(browser):
    # There may be a cookie banner which we need to close to reveal
    # the login button. If its not there just continue
    if browser.is_element_present_by_css('.iubenda-cs-close-btn', wait_time=3):
        browser.find_by_css('.iubenda-cs-close-btn').first.click()

    browser.find_by_css('input[name=email]').first.fill(settings.AHREFS_EMAIL)
    browser.find_by_css('input[name=password]').first.fill(settings.AHREFS_PASSWORD)
    browser.find_by_css('input[type=submit]').first.click()
    browser.is_element_present_by_text('Dashboard', wait_time=5)
    logger.info('Signed into ahrefs')


def export_link_data(browser):
    browser.find_by_id('export_button').first.click()
    sleep(1)

    if browser.find_by_id('CSVExportModalDialog').first.visible:
        browser.find_by_id('start_full_export').first.click()
        browser.find_by_id('start_export_button').first.click()


def download_files(browser):
    # Hack to removing blocking notification that is sometimes there
    browser.reload()

    # Click the __tray__ icon in the menu bar then click all the
    # `a` tags in order to download them
    browser.find_by_id('top_notifications').mouse_over()
    browser.find_by_id('top_notifications').first.click()

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


def clear_file_dropdown(browser):
    browser.find_by_id('removeAllExportedFiles').first.click()
    browser.find_by_text('Remove').first.click()


def get_backlinks(data=None):
    browser = Browser('chrome', headless=settings.USE_HEADLESS_CHROME)

    browser.visit('https://ahrefs.com/user/login')
    login(browser)

    for i, file in enumerate(data):
        for j, target_url in enumerate(file):
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

    # concatenate_and_clean(file)

    # driver.quit()
