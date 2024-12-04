"use effect"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, EventSchema, eventSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createEvent, createSubject, updateAnnouncement, updateEvent, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import EventForm from "./EventForm";
const EventFormContainer = async ({
         type,
         data,
         setOpen,
         relatedData,
       }: {
         type: "create" | "update";
         data?: any;
         setOpen: Dispatch<SetStateAction<boolean>>;
         relatedData?: any;
       }) => {
      return (
        <EventForm       type={type}
             data={data}
             setOpen={setOpen}
             relatedData={relatedData}/>
    )
}
export default EventFormContainer