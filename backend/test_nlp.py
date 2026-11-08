# -*- coding: utf-8 -*-
"""
TeluguTranslate AI - Test Suite
===============================
Runs automated tests on the NLP pipeline functions in app.py.
Tests normalization, punctuation handling, exact phrase matching,
case-insensitivity, whitespace collapsing, and fallback behavior.
"""

import sys
from app import normalize_text, clean_punctuation, translate_sentence, EDUCATION_DICTIONARY

def run_tests():
    print("=" * 60)
    print("Running TeluguTranslate AI NLP Unit Tests")
    print(f"Total phrases loaded in dictionary: {len(EDUCATION_DICTIONARY)}")
    print("=" * 60)

    test_cases = [
        # Standard educational test sentences
        ("Hello", "నమస్కారం"),
        ("I am a student", "నేను విద్యార్థిని"),
        ("Where is the library?", "లైబ్రరీ ఎక్కడ ఉంది?"),
        ("Please explain this", "దయచేసి దీనిని వివరించండి"),
        ("When is the exam?", "పరీక్ష ఎప్పుడు?"),
        ("Thank you", "ధన్యవాదాలు"),
        ("This is my college", "ఇది నా కళాశాల"),
        ("What is the syllabus?", "సిలబస్ ఏమిటి?"),
        ("Attendance is compulsory", "హాజరు తప్పనిసరి"),
        ("I want a book", "నాకు ఒక పుస్తకం కావాలి"),
        ("Where is the classroom?", "తరగతి గది ఎక్కడ ఉంది?"),
        ("May I come in?", "నేను లోపలికి రావచ్చా?"),
        
        # Robustness & edge cases
        ("  Where   is   the   library???  ", "లైబ్రరీ ఎక్కడ ఉంది?"),
        ("wHeN iS tHe ExAm?", "పరీక్ష ఎప్పుడు?"),
        ("i am a student.", "నేను విద్యార్థిని")
    ]

    passed = 0
    failed = 0

    for idx, (eng, expected_tel) in enumerate(test_cases, 1):
        res = translate_sentence(eng)
        actual_tel = res.get("translation", "")
        if actual_tel == expected_tel:
            print(f"[PASS] Case {idx:02d}: '{eng}' -> '{actual_tel}'")
            passed += 1
        else:
            print(f"[FAIL] Case {idx:02d}: '{eng}' Expected: '{expected_tel}', Got: '{actual_tel}'")
            failed += 1

    # Out-of-domain test
    out_of_domain = "Let us bake a chocolate cake"
    res_ood = translate_sentence(out_of_domain)
    if res_ood.get("status") == "unsupported":
        print(f"[PASS] Out-of-domain handled: '{out_of_domain}' -> status='unsupported'")
        passed += 1
    else:
        print(f"[FAIL] Out-of-domain test failed: {res_ood}")
        failed += 1

    print("=" * 60)
    print(f"Test Summary: {passed} Passed, {failed} Failed out of {len(test_cases) + 1} tests.")
    print("=" * 60)

    if failed == 0:
        print("ALL TESTS PASSED SUCCESSFULLY! Ready for deployment.")
    else:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
