import Image from "next/image";
import logo from "../../assets/skillbridge_logo.png";

const NavBar = () => {
  return (
    <div>
      {/* logo */}
      <div className="flex items-center">
        <Image
          src={logo}
          alt="site-logo"
          height={100}
          width={100}
          loading="eager"
        />
        <div>
          <h1 className="font-bold text-2xl text-shadow-2xs">
            {" "}
            <span className="text-sky-700">Skill</span> Bridge
          </h1>
        </div>
      </div>
      {/* links */}
      <div></div>
    </div>
  );
};

export default NavBar;
