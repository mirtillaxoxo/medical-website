import type { Timeslot } from '~~/shared/types/exams'

export const uesExamStore = defineStore('exam', () => {
  const examSelected = ref(225)
  function setExam(id: number) {
    examSelected.value = id
  }

  const dateTimeSelected = ref('')
  function setDateTime(datetime: string) {
    dateTimeSelected.value = datetime
  }

  const structureSelected = ref<string | null>(null)
  function setStructure(structure: string) {
    structureSelected.value = structure
  }

  const selectedExam = ref<Timeslot | null>(null)

  function setSelectedExam(exam: Timeslot) {
    selectedExam.value = exam

    examSelected.value = Number(exam.exam_id) || examSelected.value
    dateTimeSelected.value = exam.datetime
    structureSelected.value = exam.struttura
  }

  return {
    examSelected,
    dateTimeSelected,
    structureSelected,
    selectedExam,
    setExam,
    setDateTime,
    setStructure,
    setSelectedExam,
  }
})
