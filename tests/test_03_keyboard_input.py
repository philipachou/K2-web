import pytest

def test_keyboard_key_clicks(page_context):
    page = page_context
    editor = page.locator("#editor-box")
    
    # Clear editor first
    page.locator("#btn-clear").click()
    
    # Click virtual keys 'h', 'i'
    page.locator('.key:has-text("h")').first.click()
    page.locator('.key:has-text("i")').first.click()
    
    assert "hi" in editor.input_value()
