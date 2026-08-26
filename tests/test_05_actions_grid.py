import pytest

def test_actions_grid_navigation_and_insert(page_context):
    page = page_context
    editor = page.locator("#editor-box")
    
    page.locator("#btn-clear").click()
    
    # Click "Greetings" category folder
    greetings_cat = page.locator('.action-card:has-text("Greetings")')
    if greetings_cat.count() > 0:
        greetings_cat.first.click()
        page.wait_for_timeout(500)
        
        # Click an action inside Greetings (e.g. "hello")
        hello_action = page.locator('.action-card:has-text("hello")')
        if hello_action.count() > 0:
            hello_action.first.click()
            assert "hello" in editor.input_value().lower()
