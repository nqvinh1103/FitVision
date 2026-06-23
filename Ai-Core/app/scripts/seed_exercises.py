"""
Seed script: insert sample exercises into the exercises table.
Run: python -m app.scripts.seed_exercises
"""
import json
import psycopg2
from app.config import settings

EXERCISES = [
    # ── Push ──────────────────────────────────────────────────────────────────
    {
        "name": "Push Up",
        "description": "Hít đất cơ bản, tăng cường ngực, vai và tay sau. Giữ thân thẳng từ đầu đến gót.",
        "category": "Push",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["chest", "triceps", "front deltoid", "core"]),
    },
    {
        "name": "Wide Push Up",
        "description": "Hít đất tay rộng nhấn mạnh cơ ngực ngoài hơn hít đất thường.",
        "category": "Push",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["chest", "triceps", "front deltoid"]),
    },
    {
        "name": "Diamond Push Up",
        "description": "Hít đất tay hình kim cương, nhấn mạnh cơ tay sau và ngực trong.",
        "category": "Push",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["triceps", "chest", "front deltoid"]),
    },
    {
        "name": "Pike Push Up",
        "description": "Hít đất tư thế chữ V ngược, tăng cường cơ vai tương tự overhead press.",
        "category": "Push",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["shoulders", "triceps", "upper chest"]),
    },
    {
        "name": "Pseudo Planche Push Up",
        "description": "Hít đất ngón tay hướng ra sau, tăng cường vai trước và cổ tay.",
        "category": "Push",
        "difficulty": "ADVANCED",
        "muscles_targeted": json.dumps(["front deltoid", "chest", "core", "wrists"]),
    },
    {
        "name": "Handstand Push Up",
        "description": "Đẩy tay ngược từ tư thế trồng cây chuối, bài tập vai calisthenics nâng cao.",
        "category": "Push",
        "difficulty": "ADVANCED",
        "muscles_targeted": json.dumps(["shoulders", "triceps", "traps"]),
    },
    {
        "name": "Dips",
        "description": "Chống tay song song đẩy cơ thể lên xuống, tăng cường ngực dưới và tay sau.",
        "category": "Push",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["triceps", "chest", "front deltoid"]),
    },
    # ── Pull ──────────────────────────────────────────────────────────────────
    {
        "name": "Pull Up",
        "description": "Xà đơn tay sấp rộng hơn vai, tăng cường lưng trên và tay trước.",
        "category": "Pull",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["lats", "biceps", "rear deltoid", "core"]),
    },
    {
        "name": "Chin Up",
        "description": "Xà đơn tay ngửa hẹp hơn vai, tăng cường tay trước và lưng.",
        "category": "Pull",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["biceps", "lats", "rear deltoid"]),
    },
    {
        "name": "Neutral Grip Pull Up",
        "description": "Xà đôi tay song song, giảm áp lực cổ tay so với pull up thường.",
        "category": "Pull",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["lats", "biceps", "brachialis"]),
    },
    {
        "name": "Australian Pull Up",
        "description": "Xà thấp nằm nghiêng kéo ngực chạm xà, phù hợp người mới bắt đầu pull up.",
        "category": "Pull",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["lats", "rhomboids", "biceps", "rear deltoid"]),
    },
    {
        "name": "Muscle Up",
        "description": "Kết hợp pull up và dips thành một động tác liên tục, bài tập xà nâng cao.",
        "category": "Pull",
        "difficulty": "ADVANCED",
        "muscles_targeted": json.dumps(["lats", "biceps", "triceps", "chest", "core"]),
    },
    # ── Legs ──────────────────────────────────────────────────────────────────
    {
        "name": "Bodyweight Squat",
        "description": "Squat không tạ cơ bản, tăng cường đùi và mông. Thích hợp khởi động hoặc người mới.",
        "category": "Legs",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["quadriceps", "glutes", "hamstrings", "core"]),
    },
    {
        "name": "Jump Squat",
        "description": "Squat kết hợp bật nhảy tăng cường sức mạnh bùng nổ và đốt mỡ.",
        "category": "Legs",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["quadriceps", "glutes", "hamstrings", "calves"]),
    },
    {
        "name": "Pistol Squat",
        "description": "Squat một chân đòi hỏi thăng bằng và sức mạnh đùi cao, bài tập chân nâng cao.",
        "category": "Legs",
        "difficulty": "ADVANCED",
        "muscles_targeted": json.dumps(["quadriceps", "glutes", "hamstrings", "core"]),
    },
    {
        "name": "Reverse Lunges",
        "description": "Lunges bước ra sau, ít căng gối hơn lunges thường, tăng cường đùi và mông.",
        "category": "Legs",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["quadriceps", "glutes", "hamstrings"]),
    },
    {
        "name": "Bulgarian Split Squat",
        "description": "Squat một chân chân sau đặt lên ghế, nhấn mạnh đùi trước và mông.",
        "category": "Legs",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["quadriceps", "glutes", "hamstrings"]),
    },
    {
        "name": "Glute Bridge",
        "description": "Đẩy hông từ tư thế nằm ngửa, tăng cường cơ mông và đùi sau.",
        "category": "Legs",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["glutes", "hamstrings", "lower back"]),
    },
    {
        "name": "Single Leg Glute Bridge",
        "description": "Glute bridge một chân, tăng cường mông và cân bằng cơ hai bên.",
        "category": "Legs",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["glutes", "hamstrings", "core"]),
    },
    {
        "name": "Calf Raise",
        "description": "Nâng gót chân đứng một hoặc hai chân, tăng cường cơ bắp chân.",
        "category": "Legs",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["calves"]),
    },
    # ── Core ──────────────────────────────────────────────────────────────────
    {
        "name": "Plank",
        "description": "Giữ tư thế chống đẩy tĩnh, tăng cường toàn bộ core và vai.",
        "category": "Core",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["core", "shoulders", "glutes"]),
    },
    {
        "name": "Side Plank",
        "description": "Plank nghiêng một bên tăng cường cơ chéo bụng và hông.",
        "category": "Core",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["obliques", "core", "glutes"]),
    },
    {
        "name": "Hollow Body Hold",
        "description": "Nằm ngửa giữ tư thế cơ thể cong hình thuyền, nền tảng của gymnastics.",
        "category": "Core",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["core", "hip flexors", "lower back"]),
    },
    {
        "name": "L-Sit",
        "description": "Giữ chân thẳng ngang trên xà hoặc song song, bài tập core và hip flexor nâng cao.",
        "category": "Core",
        "difficulty": "ADVANCED",
        "muscles_targeted": json.dumps(["core", "hip flexors", "triceps", "shoulders"]),
    },
    {
        "name": "Hanging Knee Raise",
        "description": "Treo xà nâng gối lên bụng, tăng cường cơ bụng dưới và hip flexor.",
        "category": "Core",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["lower abs", "hip flexors", "core"]),
    },
    {
        "name": "Hanging Leg Raise",
        "description": "Treo xà nâng chân thẳng lên ngang hông, tăng cường core toàn diện.",
        "category": "Core",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["lower abs", "hip flexors", "core"]),
    },
    # ── Cardio & Full Body ────────────────────────────────────────────────────
    {
        "name": "Burpee",
        "description": "Kết hợp squat, plank, hít đất và bật nhảy, đốt mỡ toàn thân hiệu quả.",
        "category": "Cardio",
        "difficulty": "INTERMEDIATE",
        "muscles_targeted": json.dumps(["full body", "core", "cardiovascular"]),
    },
    {
        "name": "Mountain Climber",
        "description": "Tư thế plank kéo gối luân phiên vào ngực nhanh, tăng tim và core.",
        "category": "Cardio",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["core", "hip flexors", "shoulders", "cardiovascular"]),
    },
    {
        "name": "Bear Crawl",
        "description": "Bò gấu di chuyển tiến lùi, tăng cường phối hợp toàn thân và core.",
        "category": "Cardio",
        "difficulty": "BEGINNER",
        "muscles_targeted": json.dumps(["core", "shoulders", "quadriceps", "cardiovascular"]),
    },
]


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        cur = conn.cursor()
        inserted = 0
        skipped = 0
        for ex in EXERCISES:
            cur.execute("SELECT id FROM exercises WHERE name = %s", (ex["name"],))
            if cur.fetchone():
                skipped += 1
                continue
            cur.execute(
                """
                INSERT INTO exercises (name, description, category, difficulty, muscles_targeted)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    ex["name"],
                    ex["description"],
                    ex["category"],
                    ex["difficulty"],
                    ex["muscles_targeted"],
                ),
            )
            inserted += 1
        conn.commit()
        print(f"Done — inserted {inserted}, skipped {skipped} (already exist).")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
