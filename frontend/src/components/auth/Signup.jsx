import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import icons

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ---------- VALIDATION SCHEMA ----------
const schema = yup.object({
    fullname: yup.string().trim().required("Full name is required"),
    email: yup.string().required("Email is required").email("Enter a valid email address"),
    phoneNumber: yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    role: yup.string().required("Please select a role"),
    file: yup
        .mixed()
        .test("fileType", "Only JPG or PNG allowed", (value) => {
            if (!value?.[0]) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type);
        })
        .test("fileSize", "Image must be less than 2MB", (value) => {
            if (!value?.[0]) return true;
            return value[0].size <= 2 * 1024 * 1024;
        }),
});

const Signup = () => {
    const { user } = useSelector((store) => store.auth);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // <-- password toggle
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);
        formData.append("role", data.role);
        if (data.file?.[0]) formData.append("file", data.file[0]);

        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md border border-gray-200 rounded-md p-6 my-10 bg-white"
                >
                    <h1 className="font-bold text-xl mb-5 text-center">Sign Up</h1>

                    {/* Full Name */}
                    <div className="my-2">
                        <Label>Full Name</Label>
                        <Input {...register("fullname")} className={errors.fullname ? "border-red-500" : ""} />
                        {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input {...register("email")} className={errors.email ? "border-red-500" : ""} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="my-2">
                        <Label>Phone Number</Label>
                        <Input {...register("phoneNumber")} className={errors.phoneNumber ? "border-red-500" : ""} />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="my-2 relative">
                        <Label>Password</Label>
                        <Input
                            type={showPassword ? "text" : "password"} // <-- toggle type
                            {...register("password")}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        <span
                            className="absolute right-3 top-9 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Role + File */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-4">
                        <div className="flex flex-col">
                            <RadioGroup className="flex items-center gap-4 my-2">
                                <div className="flex items-center space-x-2">
                                    <Input type="radio" value="student" {...register("role")} />
                                    <Label>Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input type="radio" value="recruiter" {...register("role")} />
                                    <Label>Recruiter</Label>
                                </div>
                            </RadioGroup>
                            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <Label>Profile</Label>
                            <Input type="file" accept="image/*" {...register("file")} className={errors.file ? "border-red-500" : ""} />
                            {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    {submitting ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={!isValid}
                            className="w-full my-4 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Signup
                        </Button>
                    )}

                    <span className="text-sm block text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600">
                            Login
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
