import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { LogOut, Menu, User2, X } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {user} = useSelector(store=>store.auth);

  return (
    <div className=" px-4 sticky top-0 z-50 bg-white shadow-md transition-all">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Job<span className="text-[#f83002]">Portal</span>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex font-medium items-center gap-4 text-sm sm:text-base">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/browse">Browse</Link>
            </li>
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80">
                <div className="flex gap-4 mb-4">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Jaishikha Sharma</h4>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-gray-600 gap-2">
                  <Button
                    asChild
                    variant="link"
                    className="justify-start gap-2"
                  >
                    <Link to="/profile">
                      <User2 className="w-4 h-4" />
                      View Profile
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="justify-start gap-2"
                  >
                    <Link to="/logout">
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-2 pb-4">
          <ul className="flex flex-col font-medium gap-2 text-sm sm:text-base">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
          </ul>

          {!user ? (
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 border-t pt-2">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Jaishikha Sharma</p>
                  <p className="text-xs text-muted-foreground">Software Dev</p>
                </div>
              </div>
              <div className="flex flex-col text-gray-600 gap-2">
                <Button asChild variant="link" className="justify-start gap-2">
                  <Link to="/profile">
                    <User2 className="w-4 h-4" />
                    View Profile
                  </Link>
                </Button>
                <Button asChild variant="link" className="justify-start gap-2">
                  <Link to="/logout">
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
