import { uesExamStore } from "~/stores/exam";

const getLocalHour = (datetime: string) => {
  return new Date(datetime).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
};

const getLocalDate = (datetime: string) => {
  return new Date(datetime).toLocaleDateString("sv-SE", {
    timeZone: "Europe/Rome",
  });
};

export const usebookingAvailabilities = (initialStructure?: string) => {
  const { data: structures } = useStructures();
  const examStore = uesExamStore();

  if (!examStore.structureSelected) {
    examStore.structureSelected = "all";
  }

  /**
   * TUTTI GLI SLOT DA SANITY
   */
  const slots = computed(() =>
    (structures.value ?? []).flatMap((structure) =>
      (structure.exams ?? []).flatMap((examData) => {
        if (!examData.exam?._id) return [];

        const dates = examData.datetime?.dates ?? [];

        return dates.map((datetime) => ({
          exam_id: examData.exam._id,
          exam_name: examData.exam.title,
          struttura: structure.title,
          structure_id: structure.structure_id,
          datetime,
        }));
      }),
    ),
  );

  /**
   * ESAMI
   *
   * Il nome arriva direttamente da Sanity:
   * exam.title
   */
  const exams = computed(() => {
    const map = new Map<
      string,
      {
        exam_id: string;
        exam_name: string;
      }
    >();

    slots.value.forEach((slot) => {
      if (!map.has(slot.exam_id)) {
        map.set(slot.exam_id, {
          exam_id: slot.exam_id,
          exam_name: slot.exam_name,
        });
      }
    });

    return [...map.values()];
  });

  const selectedExamId = ref("");

  watchEffect(() => {
    if (
      selectedExamId.value &&
      exams.value.some((exam) => exam.exam_id === selectedExamId.value)
    ) {
      return;
    }

    const firstExam = exams.value[0];

    if (firstExam) {
      selectedExamId.value = firstExam.exam_id;
    }
  });

  /**
   * DATE DISPONIBILI
   */
  const dates = computed(() =>
    [...new Set(slots.value.map((slot) => getLocalDate(slot.datetime)))].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    ),
  );

  /**
   * STRUTTURE
   *
   * Arrivano esclusivamente da Sanity.
   */
  const structuresMaster = computed(() => {
    const map = new Map();

    (structures.value ?? []).forEach((structure) => {
      if (!map.has(structure.structure_id)) {
        map.set(structure.structure_id, {
          id: structure.structure_id,
          label: structure.title,
        });
      }
    });

    return [
      {
        id: "all",
        label: "Qualsiasi struttura",
      },
      ...map.values(),
    ];
  });

  /**
   * STRUTTURA SELEZIONATA
   */
  const structureSelected = computed({
    get: () => examStore.structureSelected,
    set: (value) => {
      examStore.structureSelected = value;
    },
  });

  /**
   * APPLICA STRUTTURA INIZIALE
   */
  const initialStructureApplied = ref(false);

  watchEffect(() => {
    if (initialStructureApplied.value) return;

    if (!structuresMaster.value.length) return;

    if (!initialStructure) {
      initialStructureApplied.value = true;
      return;
    }

    const exists = structuresMaster.value.some(
      (structure) => structure.id === initialStructure,
    );

    if (exists) {
      examStore.structureSelected = initialStructure;
    }

    initialStructureApplied.value = true;
  });

  /**
   * FILTRA GLI SLOT PER STRUTTURA
   */
  const filteredSlots = computed(() => {
    return slots.value.filter((slot) => {
      const matchesExam =
        !selectedExamId.value || slot.exam_id === selectedExamId.value;

      const matchesStructure =
        structureSelected.value === "all" ||
        slot.structure_id === structureSelected.value;

      return matchesExam && matchesStructure;
    });
  });

  /**
   * DISPONIBILITÀ DEGLI ESAMI
   */
  const examAvailabilities = computed(() =>
    exams.value.map((exam) => {
      const examSlots = filteredSlots.value.filter(
        (slot) => slot.exam_id === exam.exam_id,
      );

      const datesMap = new Map();

      examSlots.forEach((slot) => {
        const date = getLocalDate(slot.datetime);

        if (!datesMap.has(date)) {
          datesMap.set(date, []);
        }

        datesMap.get(date).push(slot);
      });

      return {
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        dates: [...datesMap.entries()]
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([date, timeslots]) => ({
            date,
            timeslots: timeslots.sort(
              (a: any, b: any) =>
                new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
            ),
          })),
      };
    }),
  );

  /**
   * TUTTE LE STRUTTURE
   */
  const allStructures = computed(() =>
    structuresMaster.value.filter((structure) => structure.id !== "all"),
  );

  /**
   * NESSUNA DISPONIBILITÀ
   */
  const hasNoAvailabilityForStructure = computed(
    () => structureSelected.value !== "all" && filteredSlots.value.length === 0,
  );

  /**
   * RESTITUISCE LE DISPONIBILITÀ
   * RAGGRUPPATE PER GIORNO / ORA
   */
  const mergedAvailabilities = computed(() => {
    const dayMap = new Map<string, Map<string, any[]>>();

    examAvailabilities.value.forEach((exam) => {
      exam.dates.forEach((dateData) => {
        if (!dayMap.has(dateData.date)) {
          dayMap.set(dateData.date, new Map<string, any[]>());
        }

        const hourMap = dayMap.get(dateData.date)!;

        dateData.timeslots.forEach((slot: any) => {
          const hour = getLocalHour(slot.datetime);

          if (!hourMap.has(hour)) {
            hourMap.set(hour, []);
          }

          const list = hourMap.get(hour)!;

          const exists = list.some(
            (existing: any) =>
              existing.exam_id === slot.exam_id &&
              existing.datetime === slot.datetime &&
              existing.structure_id === slot.structure_id,
          );

          if (!exists) {
            list.push(slot);
          }
        });
      });
    });

    return Array.from(dayMap.entries())
      .map(([date, hoursMap]) => ({
        date,
        timeslots: Array.from(hoursMap.entries())
          .map(([time, slots]) => ({
            time,
            slots,
          }))
          .sort((a, b) => String(a.time).localeCompare(String(b.time))),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  return {
    examStore,

    exams,
    selectedExamId,

    dates,
    examAvailabilities,
    mergedAvailabilities,

    structureSelected,
    structuresMaster,
    allStructures,

    filteredSlots,

    hasNoAvailabilityForStructure,
  };
};
