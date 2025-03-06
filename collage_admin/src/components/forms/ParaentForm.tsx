// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import Image from "next/image";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
// import { useFormState } from "react-dom";
// import { createParent, updateParent } from "@/lib/actions";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { CldUploadWidget } from "next-cloudinary";

// const ParentForm = ({
//   type,
//   data,
//   setOpen,
// }: {
//   type: "create" | "update";
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ParentSchema>({
//     resolver: zodResolver(parentSchema),
//     defaultValues: data || {},
//   });

//   const [img, setImg] = useState<any>(data?.img || null);

//   const [state, formAction] = useFormState(
//     type === "create" ? createParent : updateParent,
//     {
//       success: false,
//       error: false,
//     }
//   );

//   const onSubmit = handleSubmit((formData) => {
//     formAction({ ...formData, img: img?.secure_url });
//   });

//   const router = useRouter();

//   useEffect(() => {
//     if (state.success) {
//       toast.success(`Parent has been ${type === "create" ? "created" : "updated"}!`);
//       setOpen(false);
//       router.refresh();
//     }
//   }, [state, router, type, setOpen]);

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create a new parent" : "Update the parent"}
//       </h1>
//       <div className="flex justify-between flex-wrap gap-4">
//         <InputField
//           label="First Name"
//           name="name"
//           register={register}
//           error={errors.name}
//         />
//         <InputField
//           label="Last Name"
//           name="surname"
//           register={register}
//           error={errors.surname}
//         />
//         <InputField
//           label="Phone"
//           name="phone"
//           register={register}
//           error={errors.phone}
//         />
//         <InputField
//           label="Address"
//           name="address"
//           register={register}
//           error={errors.address}
//         />
//       </div>
//       <CldUploadWidget
//         uploadPreset="collage"
//         onSuccess={(result, { widget }) => {
//           setImg(result.info);
//           widget.close();
//         }}
//       >
//         {({ open }) => (
//           <div
//             className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
//             onClick={() => open()}
//           >
//             <Image src="/upload.png" alt="Upload" width={28} height={28} />
//             <span>Upload a photo</span>
//           </div>
//         )}
//       </CldUploadWidget>
//       {img && (
//         <div className="flex justify-center">
//           <Image src={img.secure_url} alt="Uploaded Image" width={100} height={100} className="rounded-md" />
//         </div>
//       )}
//       {state.error && <span className="text-red-500">Something went wrong!</span>}
//       <button className="bg-blue-400 text-white p-2 rounded-md">
//         {type === "create" ? "Create" : "Update"}
//       </button>
//     </form>
//   );
// };

// export default ParentForm;
