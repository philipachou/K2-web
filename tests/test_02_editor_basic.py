import pytest

def test_editor_typing_and_deletion(page_context):
    page = page_context
    editor = page.locator("#editor-box")
    
    # 1. Type text
    editor.fill("Hello world")
    assert editor.input_value() == "Hello world"
    
    # 2. Del Char
    page.locator("#btn-del-char").click()
    assert editor.input_value() == "Hello worl"
    
    # 3. Del Word
    page.locator("#btn-del-word").click()
    assert editor.input_value() == "Hello "
    
    # 4. Del All
    page.locator("#btn-clear").click()
    assert editor.input_value() == ""
