
import Link from "next/link";

export default function HalfNavbar1() {
  
  return (
    <nav className="bg-black px-4 py-3 flex items-center justify-between">
      <Link href="/home" className="flex items-center cursor-pointer">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 20L4 4M20 4L4 20"
            stroke="#F96C41"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Link>

      <div className="flex items-center">
        <img
          src="/images/evcartrips-logo.png"
          alt="evcartrips.com"
          className="h-8 w-auto md:h-10"
        />
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="relative">
          <img
            src="/images/icons/cart_icon.png"
            className="h-5 w-5 md:h-6 md:w-6"
            alt="Cart"
          />
          <div className="absolute -top-0 -right-0 bg-orange-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
            1
          </div>
        </div>

        <div className=" p-1">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.75 6.93751L17.76 5.78579C16.9206 4.90415 15.9106 4.20252 14.7914 3.7236C13.6722 3.24468 12.4673 2.99849 11.25 3.00001C6.28125 3.00001 2.25 7.03126 2.25 12C2.25 16.9688 6.28125 21 11.25 21C13.1114 20.9999 14.927 20.4229 16.447 19.3484C17.967 18.2739 19.1166 16.7548 19.7377 15"
              stroke="white"
              strokeWidth="0.919355"
              strokeMiterlimit="10"
              strokeLinecap="square"
            />
            <path
              d="M21.75 3.20864V10.3125C21.75 10.3623 21.7303 10.41 21.6951 10.4451C21.66 10.4803 21.6123 10.5 21.5625 10.5H14.4586C14.4215 10.5001 14.3853 10.4891 14.3544 10.4685C14.3235 10.4479 14.2995 10.4186 14.2853 10.3843C14.2711 10.35 14.2674 10.3123 14.2746 10.2759C14.2819 10.2395 14.2997 10.2061 14.326 10.1799L21.4299 3.07599C21.4561 3.04974 21.4895 3.03185 21.5259 3.02461C21.5623 3.01736 21.6 3.02107 21.6343 3.03528C21.6686 3.04948 21.6979 3.07354 21.7185 3.1044C21.7391 3.13526 21.7501 3.17154 21.75 3.20864Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}
