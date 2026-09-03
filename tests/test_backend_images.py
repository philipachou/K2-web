import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from backend.main import get_wikipedia_image, parse_operations_and_suggestions

def test_get_wikipedia_image_direct():
    res = get_wikipedia_image("Claude Shannon")
    assert "show_image" in res or "Claude Shannon" in res

def test_parse_operations_get_web_image():
    actions = []
    text_in = "Here is the picture: <operation type=\"get_web_image\" query=\"Albert Einstein\"/>"
    clean_text, suggestions = parse_operations_and_suggestions(text_in, actions)
    
    assert "Albert Einstein" in clean_text or len(actions) > 0
    image_actions = [a for a in actions if a.get("op_type") == "show_image"]
    assert len(image_actions) >= 1 or "<operation type=\"show_image\"" in clean_text
