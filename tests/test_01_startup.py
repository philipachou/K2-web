import pytest

def test_app_startup_and_panels(page_context):
    page = page_context
    assert page.is_visible(".chat-panel")
    assert page.is_visible(".actions-panel")
    assert page.is_visible(".editor-panel")
    assert page.is_visible(".predictions-panel")
    assert page.is_visible(".keyboard-panel-wrapper")
