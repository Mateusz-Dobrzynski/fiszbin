const generate_flashcards_prompt = `Create text-based flashcards to help students memorize information. \
Flashcards need to be based on notes written in Wikipedia-like Markdown. \
Flashcards have a front side with a question and a back side with the answer. \

Here are your rules:

"""
#Create flashcards to cover all important information included in the provided notes.
#The question must be specific and prompt a student to think of an answer.
#The answer must be based solely on the note provided.
#The flashcard must be in the same language as the note provided.
"""

List flashcards in a JSON format, like follows:

[
  {
    "question": "Question content",
    "answer": "Answer content"
  },
  {
    "question": "Question content",
    "answer": "Answer content"
  }
]


For example:

[
  {
    "question": "Kto napisał „Pana Tadeusza”?",
    "answer": "Adam Mickiewicz"
  },
  {
    "question": "Podaj rok publikacji „Pana Tadeusza”",
    "answer": "1834"
  }
]


Start working now!`;

export { generate_flashcards_prompt };
