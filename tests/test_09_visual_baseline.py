import os
import pytest
from PIL import Image, ImageChops

BASELINE_DIR = os.path.join("tests", "screenshots", "baseline")
CURRENT_DIR = os.path.join("tests", "screenshots", "current")
DIFF_DIR = os.path.join("tests", "screenshots", "diff")

os.makedirs(CURRENT_DIR, exist_ok=True)
os.makedirs(DIFF_DIR, exist_ok=True)

def compare_images(baseline_path, current_path, diff_path, max_diff_percent=0.1):
    """
    Compares baseline PNG against current screenshot pixel-by-pixel.
    Returns (diff_percentage, is_pass).
    """
    img1 = Image.open(baseline_path).convert("RGB")
    img2 = Image.open(current_path).convert("RGB")
    
    if img1.size != img2.size:
        img2 = img2.resize(img1.size, Image.Resampling.LANCZOS)
    
    diff = ImageChops.difference(img1, img2)
    gray_diff = diff.convert("L")
    
    threshold_filter = gray_diff.point(lambda p: 255 if p > 10 else 0)
    data = threshold_filter.get_flattened_data() if hasattr(threshold_filter, 'get_flattened_data') else threshold_filter.getdata()
    differing_pixels = sum(1 for p in data if p > 0)
    total_pixels = img1.width * img1.height
    diff_ratio = (differing_pixels / total_pixels) * 100.0
    
    if diff_ratio > max_diff_percent:
        diff_mask = threshold_filter.convert("L")
        red_overlay = Image.new("RGB", img1.size, (255, 0, 128))
        diff_visual = Image.composite(red_overlay, img1, diff_mask)
        diff_visual.save(diff_path)
        return diff_ratio, False
    
    return diff_ratio, True

def test_visual_01_ipad_landscape_default(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(1200)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "01_ipad_landscape_default.png")
    baseline_path = os.path.join(BASELINE_DIR, "01_ipad_landscape_default.png")
    diff_path = os.path.join(DIFF_DIR, "01_ipad_landscape_default_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 01_ipad_landscape_default! {diff_ratio:.2f}% pixel difference."

def test_visual_02_iphone_portrait_default(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(1200)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "02_iphone_portrait_default.png")
    baseline_path = os.path.join(BASELINE_DIR, "02_iphone_portrait_default.png")
    diff_path = os.path.join(DIFF_DIR, "02_iphone_portrait_default_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 02_iphone_portrait_default! {diff_ratio:.2f}% pixel difference."

def test_visual_03_ipad_chat_collapsed(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(800)
    
    page.locator(".chat-panel .panel-label").click()
    page.wait_for_timeout(800)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "03_ipad_chat_collapsed.png")
    baseline_path = os.path.join(BASELINE_DIR, "03_ipad_chat_collapsed.png")
    diff_path = os.path.join(DIFF_DIR, "03_ipad_chat_collapsed_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 03_ipad_chat_collapsed! {diff_ratio:.2f}% pixel difference."

def test_visual_04_ipad_actions_drilled(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(800)
    
    greetings_card = page.locator('.category-card:has-text("Greetings")')
    if greetings_card.count() > 0:
        greetings_card.first.click()
        page.wait_for_timeout(800)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "04_ipad_actions_drilled.png")
    baseline_path = os.path.join(BASELINE_DIR, "04_ipad_actions_drilled.png")
    diff_path = os.path.join(DIFF_DIR, "04_ipad_actions_drilled_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 04_ipad_actions_drilled! {diff_ratio:.2f}% pixel difference."

def test_visual_05_ipad_editor_typing(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(800)
    
    editor = page.locator("#editor-box")
    editor.fill("Testing visual baseline screenshot comparison")
    page.wait_for_timeout(1200)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "05_ipad_editor_typing.png")
    baseline_path = os.path.join(BASELINE_DIR, "05_ipad_editor_typing.png")
    diff_path = os.path.join(DIFF_DIR, "05_ipad_editor_typing_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 05_ipad_editor_typing! {diff_ratio:.2f}% pixel difference."

def test_visual_06_ipad_predictor_active(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(800)
    
    editor = page.locator("#editor-box")
    editor.fill("t")
    page.wait_for_timeout(1200)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "06_ipad_predictor_active.png")
    baseline_path = os.path.join(BASELINE_DIR, "06_ipad_predictor_active.png")
    diff_path = os.path.join(DIFF_DIR, "06_ipad_predictor_active_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 06_ipad_predictor_active! {diff_ratio:.2f}% pixel difference."

def test_visual_07_ipad_settings_modal(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={"width": 1194, "height": 834}, device_scale_factor=2.0)
    page = context.new_page()
    page.goto("http://127.0.0.1:8000/")
    page.wait_for_timeout(800)
    
    page.locator("#btn-settings").click()
    page.wait_for_timeout(800)
    page.evaluate("document.activeElement?.blur()")
    page.wait_for_timeout(200)
    
    current_path = os.path.join(CURRENT_DIR, "07_ipad_settings_modal.png")
    baseline_path = os.path.join(BASELINE_DIR, "07_ipad_settings_modal.png")
    diff_path = os.path.join(DIFF_DIR, "07_ipad_settings_modal_diff.png")
    
    page.screenshot(path=current_path)
    browser.close()
    
    diff_ratio, is_pass = compare_images(baseline_path, current_path, diff_path)
    assert is_pass, f"Visual regression in 07_ipad_settings_modal! {diff_ratio:.2f}% pixel difference."
