import codecs
import logging
import os
from time import sleep

from django.conf import settings
from splinter import Browser

# from merge_files import concatenate_and_clean


logger = logging.getLogger(__name__)

# # File paths
# pwd = os.getcwd()
# DOWNLOADS_PATH = '{}/downloads'.format(pwd)
# OUTPUT_FILES_PATH = '{}/merged_files'.format(pwd)


def login(browser):
    # There may be a cookie banner which we need to close to reveal
    # the login button. If its not there just continue
    if browser.is_element_present_by_css('.iubenda-cs-close-btn', wait_time=3):
        browser.find_by_css('.iubenda-cs-close-btn').first.click()

    browser.find_by_css('input[name=email]').first.fill(settings.AHREFS_EMAIL)
    browser.find_by_css('input[name=password]').first.fill(settings.AHREFS_PASSWORD)
    browser.find_by_css('input[type=submit]').first.click()
    logger.info('Signed into ahrefs')


def export_link_data(browser):
    browser.find_by_id('export_button').first.click()
    browser.find_by_id('start_full_export').first.click()
    browser.find_by_id('start_export_button').first.click()


# def download_files(browser):
#     # Click the __tray__ icon in the menu bar then click all the
#     # `a` tags in order to download them
#     a_tag_name = 'a[name=link_to_download]'
#     el_id = 'top_notifications'

#     WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, el_id)))

#     driver.execute_script('document.getElementById("{}").click();'.format(el_id))

#     WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.CSS_SELECTOR, a_tag_name))
#     )

#     a_tags = driver.find_elements_by_css_selector(a_tag_name)
#     for a_tag in a_tags:
#         a_tag.click()


# def sleep_then_download():
#     # Quick hack to remove notification as it was blocking the download button
#     driver.refresh()
#     # Sleep to make sure all files have completed export
#     sleep(300)
#     download_files()


# def clear_file_dropdown():
#     driver.find_element_by_id('removeAllExportedFiles').click()
#     WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.CSS_SELECTOR, '.modal'))
#     )
#     driver.execute_script("deleteCSVFile('all');")


def get_backlinks():
    browser = Browser('chrome', headless=settings.USE_HEADLESS_CHROME)

    input = [
        [
            'http://www.cascadiakids.com/35-free-and-cheap-things-to-do-in-victoria-with-kids/',
            'http://hikingalaska.net/2015/09/19/5-kid-friendly-trails-in-southcentral-alaska/',
            'https://headingforthehills.com/',
            'http://rainorshinemamma.com/hiking-with-toddlers/',
            'http://www.wcfymca.org/index.php/healthy-living-in-washington-county-indiana/39-healthy-living/healthy-living/306-family-hiking-club',
            'http://www.cascadiakids.com/seattle-airport-with-kids/',
            'http://www.utahhome.me/2015/06/summertime-adventures-top-five-family-friendly-hikes-in-utah/',
            'https://vimeo.com/21430461',
            'https://nobackhome.com/tag/hiking-with-kids/page/2/',
            'https://www.lynnevenner.com/five-whistler-family-friendly-hikes/',
            'http://www.justjared.com/2012/03/01/natalie-portman-hiking-with-aleph/',
        ]
    ]

    browser.visit('https://ahrefs.com/user/login')
    login(browser)

    # for i, file in enumerate(input):
    #     for j, target_url in enumerate(file):
    #         browser.visit(
    #             f'https://ahrefs.com/site-explorer/backlinks/v5/external/prefix/live/all/dofollow/1/ahrefs_rank_desc?target={target_url}'
    #         )

    #         export_link_data(browser)

    #         # Export 100 files, download them, clean up, continue
    #         if j > 0 and j % 100 == 0:
    #             sleep_then_download()
    #             # Sleep to make sure all files have completed
    #             # downloading
    #             sleep(300)
    #             clear_file_dropdown()

    #     # Download any of the leftovers
    #     sleep_then_download()
    #     sleep(300)
    #     clear_file_dropdown()

    # concatenate_and_clean(file)

    # driver.quit()
