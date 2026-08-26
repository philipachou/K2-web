import pytest

def test_panel_collapse_toggle(page_context):
    page = page_context
    chat_panel = page.locator(".chat-panel")
    
    # Click chat log label to collapse
    chat_label = page.locator('.chat-panel .panel-label')
    chat_label.click()
    page.wait_for_timeout(500)
    
    assert "collapsed" in (chat_panel.get_attribute("class") or "")
    
    # Click again to expand
    chat_label.click()
    page.wait_for_timeout(500)
    
    assert "collapsed" not in (chat_panel.get_attribute("class") or "")
