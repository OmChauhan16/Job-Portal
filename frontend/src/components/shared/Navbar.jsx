import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    const defaultStudent =
        "https://i.pravatar.cc/40?u=student"; // small avatar image
    const defaultRecruiter =
        "https://i.pravatar.cc/40?u=recruiter";

    return (
        <div className='bg-white relative'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='hidden md:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback>
                                            {user?.fullname?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>

                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar>
                                                <AvatarImage src={user?.profile?.profilePhoto} />
                                                <AvatarFallback>
                                                    {user?.fullname?.[0] || "U"}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
                <div className='md:hidden'>
                    <button onClick={() => setIsOpen(!isOpen)} className='text-2xl'>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className='md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-t'>
                    <ul className='flex flex-col items-center gap-4 py-4'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" onClick={() => setIsOpen(false)}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" onClick={() => setIsOpen(false)}>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                                    <li><Link to="/jobs" onClick={() => setIsOpen(false)}>Jobs</Link></li>
                                    <li><Link to="/browse" onClick={() => setIsOpen(false)}>Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    <div className='flex flex-col items-center gap-2 pb-4'>
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="outline">Login</Button></Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </>
                        ) : (
                            <div className='flex flex-col items-center gap-2'>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                    <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <h4 className='font-medium'>{user?.fullname}</h4>
                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                {
                                    user && user.role === 'student' && (
                                        <Button variant="link"><Link to="/profile" onClick={() => setIsOpen(false)}>View Profile</Link></Button>
                                    )
                                }
                                <Button onClick={() => { logoutHandler(); setIsOpen(false); }} variant="link">Logout</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar