import pytest

def test_settings_modal_open_and_close(page_context):
    page = page_context
    modal = page.locator("#settings-modal")
    
    # Open settings
    page.locator("#btn-settings").click()
    page.wait_for_timeout(500)
    
    assert modal.is_visible()
    
    # Close & Save settings
    page.locator("#btn-settings-close").click()
    page.wait_for_timeout(500)
    
    assert not modal.is_visible()
