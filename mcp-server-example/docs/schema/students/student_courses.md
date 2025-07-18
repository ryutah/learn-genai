# student_courses

## Description

<details>
<summary><strong>Table Definition</strong></summary>

```sql
CREATE TABLE student_courses (
  course_id VARCHAR(16)
  , student_id BIGINT

  , FOREIGN KEY (course_id) REFERENCES courses(course_id)
  , FOREIGN KEY (student_id) REFERENCES students(student_id)
  , PRIMARY KEY (course_id, student_id)
)
```

</details>

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| course_id | VARCHAR(16) |  | true |  | [courses](courses.md) |  |
| student_id | BIGINT |  | true |  | [students](students.md) |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| course_id | PRIMARY KEY | PRIMARY KEY (course_id) |
| student_id | PRIMARY KEY | PRIMARY KEY (student_id) |
| - (Foreign key ID: 0) | FOREIGN KEY | FOREIGN KEY (student_id) REFERENCES students (student_id) ON UPDATE NO ACTION ON DELETE NO ACTION MATCH NONE |
| - (Foreign key ID: 1) | FOREIGN KEY | FOREIGN KEY (course_id) REFERENCES courses (course_id) ON UPDATE NO ACTION ON DELETE NO ACTION MATCH NONE |
| sqlite_autoindex_student_courses_1 | PRIMARY KEY | PRIMARY KEY (course_id, student_id) |

## Indexes

| Name | Definition |
| ---- | ---------- |
| sqlite_autoindex_student_courses_1 | PRIMARY KEY (course_id, student_id) |

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
