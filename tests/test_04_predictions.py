import pytest

def test_word_predictions(page_context):
    page = page_context
    editor = page.locator("#editor-box")
    
    page.locator("#btn-clear").click()
    editor.fill("t")
    page.wait_for_timeout(1500)
    
    word_buttons = page.locator("#word-predictions .predict-btn")
    assert word_buttons.count() > 0
    
    # Click the first word prediction button
    word_buttons.first.click()
    assert len(editor.input_value()) > 1
