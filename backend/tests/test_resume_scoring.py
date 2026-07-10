import unittest

from agent.resume_scoring import build_resume_scoring_prompt, build_upload_message, clean_jd_text


class ResumeScoringTest(unittest.TestCase):
    def test_prompt_contains_rubric_without_leaking_resume_as_display_text(self):
        prompt = build_resume_scoring_prompt(
            jd_text="前端工程师，要求 React、项目上线经验",
            resume_text="候选人简历原文：React 项目经验三年",
        )

        self.assertIn("JD匹配度，满分30分", prompt)
        self.assertIn("核心能力，满分25分", prompt)
        self.assertIn("项目/作品质量，满分20分", prompt)
        self.assertIn("稳定性，满分10分", prompt)
        self.assertIn("最终只输出评分结果和修改意见", prompt)
        self.assertIn("候选人简历原文：React 项目经验三年", prompt)

        display = build_upload_message("请匹配这个 JD", ["resume.pdf"])
        self.assertIn("请匹配这个 JD", display)
        self.assertIn("resume.pdf", display)
        self.assertNotIn("候选人简历原文", display)

    def test_clean_jd_text_removes_uploaded_file_line(self):
        jd = clean_jd_text("前端工程师，要求 React\n已上传简历PDF：resume.pdf")

        self.assertEqual(jd, "前端工程师，要求 React")


if __name__ == "__main__":
    unittest.main()
