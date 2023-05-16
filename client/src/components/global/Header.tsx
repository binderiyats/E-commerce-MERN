import { FC } from "react";
import { HiOutlineTruck, HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/logo-header.svg";
import { Link } from "react-router-dom";

export interface HeaderMenuItem {
  title: string;
  link: string;
  children?: HeaderMenuItem[];
}

const Header: FC = () => {
  const HeaderMenuItems: HeaderMenuItem[] = [
    { title: "Home", link: "/" },
    { title: "Blog", link: "/" },
    { title: "Contact Us", link: "/" },
    { title: "About Us", link: "/" },
  ];

  return (
    <div className="">
      <div className="bg-[#F5F5F5]">
        <div className="w-full myContainer flex items-center justify-between py-5">
          <span className="text-text text-xs-regular">
            Need help? Call us: (+98) 0234 456 789
          </span>
          <div className="flex items-center justify-between gap-[36px]">
            <div className="flex items-center gap-5 text-xs-regular text-text">
              <HiOutlineLocationMarker size={24} />
              <span>Our store</span>
            </div>
            <div className="flex items-center gap-5 text-xs-regular text-text">
              <HiOutlineTruck size={24} />
              <span>Track your order</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-color-1">
        <div className="myContainer py-5 px-[60px] flex items-center justify-between">
          <div className="flex items-center gap-[85px]">
            <img src={logo} alt="" />
            <div className="relative w-[438px] h-[56px]">
              <input
                type="text"
                placeholder="Search any things"
                className="w-full h-full rounded-[20px] text-text text-xs-regular placeholder:text-text px-[25px]"
              />
              <button className="absolute bg-color-2 text-white rounded-[20px] px-[41px] py-[17px] text-xs-regular right-0">
                Search
              </button>
            </div>
          </div>
          <div className="flex items-center gap-[29px] text-white text-xs-regular">
            <div className="flex items-center gap-3">
              <BiUser size={24} />
              <span className="">Sign in</span>
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineHeart size={24} />
              <span className="bg-color-2 rounded-full px-1 text-[9px] font-normal leading-[14px]">
                0
              </span>
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineShoppingCart size={24} />
              <span className="bg-color-2 rounded-full px-1 text-[9px] font-normal leading-[14px]">
                0
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-color-3">
        <div className="myContainer flex items-center justify-between">
          <div className="flex items-center gap-[90px]">
            <button className="bg-color-2 text-white text-base-medium py-6 px-4 flex items-center gap-4">
              Browse categories
              <BsChevronDown />
            </button>
            <ul className="flex text-base-medium text-color-4">
              {HeaderMenuItems.map((menuItem, index) => (
                <li
                  key={`header-menu-${index}`}
                  className="py-2 px-4 hover:text-color-6 hover:bg-white/[.15] rounded-lg duration-300 group relative"
                >
                  <Link className="flex items-center gap-1" to={menuItem.link}>
                    {menuItem.title}
                    {menuItem.children && <BsChevronDown size={18} />}
                  </Link>
                  {/* {menuItem.children && (
                    <NavbarDroprown headerMenuChildren={menuItem.children} />
                  )} */}
                </li>
              ))}
            </ul>
          </div>
          <span className="text-base-bold text-color-1">
            30 Days Free Return
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
