import type { StructuresDocument } from "~~/shared/types/structures";

export default eventHandler(async (event) => {
  try {
    const query = groq`*[_type == "structures"]{
    _id,
    title,
    structure_id,
    contacts,
    location,
    note,

    exams[]{
      "datetime": {
        "_type": "recurrence",
        "dates": datetime.dates[
          dateTime(@) >= dateTime(now())
        ]
      },

      exam->{
        _id,
        title,

        prices[]{
          "structure_id": structure->structure_id,
          amount,
          currency
        },

        slug,
        strumentations
      }
    }
  }`;

    return await useSanity(event).fetch<StructuresDocument[]>(query);
    /**
     *
     * ERRORS
     */
  } catch (e) {
    console.error(e);

    throw e;
  }
});
