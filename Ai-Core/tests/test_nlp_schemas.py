from app.models.job_schemas import NlpJobPayload, ExerciseSlot, ProgramOutput


def test_nlp_job_payload_defaults_context_to_none():
    p = NlpJobPayload(userId=1, prompt="giáo án tăng cơ")
    assert p.context is None


def test_nlp_job_payload_accepts_optional_context():
    p = NlpJobPayload(userId=1, prompt="test", context="3 buổi/tuần")
    assert p.context == "3 buổi/tuần"


def test_program_output_validates_full_structure():
    data = {
        "program_name": "Giáo án tăng cơ",
        "description": "Chương trình 4 tuần cho người mới",
        "duration_weeks": 4,
        "sessions_per_week": 3,
        "exercises": [
            {
                "exercise_id": 1,
                "day_of_week": 1,
                "sets": 3,
                "reps": 12,
                "order_in_session": 1,
                "notes": None,
            }
        ],
    }
    out = ProgramOutput(**data)
    assert out.duration_weeks == 4
    assert len(out.exercises) == 1
    assert out.exercises[0].notes is None


def test_exercise_slot_notes_defaults_to_none():
    slot = ExerciseSlot(
        exercise_id=5, day_of_week=2, sets=4, reps=10, order_in_session=2
    )
    assert slot.notes is None


def test_program_output_model_dump_is_json_serializable():
    import json
    out = ProgramOutput(
        program_name="Test",
        description="Desc",
        duration_weeks=4,
        sessions_per_week=3,
        exercises=[
            ExerciseSlot(exercise_id=1, day_of_week=1, sets=3, reps=12, order_in_session=1)
        ],
    )
    dumped = out.model_dump()
    assert json.dumps(dumped)  # must not raise
