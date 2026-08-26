import pytest

def test_local_tts_trigger(page_context):
    page = page_context
    editor = page.locator("#editor-box")
    
    # Fill editor with test text
    editor.fill("Testing speech synthesis")
    
    # Click Local TTS button
    local_tts_btn = page.locator("#btn-local-tts")
    local_tts_btn.click()
    page.wait_for_timeout(1000)
    
    # Verify chat log records speaking activity
    chat_log = page.locator("#chat-log-scroll")
    assert "speaking" in chat_log.inner_text().lower() or "tts" in chat_log.inner_text().lower()
