import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validate = () => {
        const newErrors = {};

        if (!input.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(input.email))
            newErrors.email = "Enter a valid email";

        if (!input.password.trim()) newErrors.password = "Password is required";

        if (!input.role) newErrors.role = "Select your role";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear field error
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);

            const res = await axios.post(
                `${USER_API_END_POINT}/login`,
                input,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
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

            <div className="max-w-7xl mx-auto w-full">
                <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4 ">
                    <form
                        onSubmit={submitHandler}
                        className="w-full max-w-md border border-gray-200 rounded-md p-6 bg-white shadow-sm"
                    >


                        <h1 className="font-bold text-xl mb-5">Login</h1>

                        {/* Email */}
                        <div className="my-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="my-2">
                            <Label>Password</Label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    className={errors.password ? "border-red-500" : ""}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-sm text-gray-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Role */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-6">
                                <label className="flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === "student"}
                                        onChange={changeEventHandler}
                                    />
                                    Student
                                </label>

                                <label className="flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === "recruiter"}
                                        onChange={changeEventHandler}
                                    />
                                    Recruiter
                                </label>
                            </div>
                        </div>
                        {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}

                        {/* Submit */}
                        {submitting ? (
                            <Button disabled className="w-full my-4">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">
                                Login
                            </Button>
                        )}

                        <span className="text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-600">
                                Signup
                            </Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
