import Image from "next/image";
import { useState } from "react";

const TabList: React.FC = () => {
  const tabs = [
    "Dashboard",
    "Banking",
    "Telefonie",
    "Accounting",
    "Verkauf",
    "Statistik",
    "Post Office",
    "Administration",
    "Help",
    "Warenbestand",
    "Auswahllisten",
    "Einkauf",
    "Rechn",
  ];

  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [addTabStatus, setAddTabStatus] = useState(false);

  const addTab = (tab: string) => {
    if (activeTabs.length < 9 && !activeTabs.includes(tab)) {
      setActiveTabs((prevTabs) => [...prevTabs, tab]);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[62px] bg-[#FFFFFF]" />

      <div className="flex-1 relative">
        <div className="w-full h-[69px] border border-[#AEB6CE33]"></div>

        <div className="flex items-center space-x-4">
          <div className="px-[20px] py-[16px] m-0">
            <Image
              src={"img/Lagerverwaltung.svg"}
              alt="lagerverwaltung"
              width={16}
              height={16}
            />
          </div>

          {activeTabs.map((tab, index) => (
            <div
              key={index}
              className="flex items-center bg-[#FEFEFE] text-[#7F858D] px-[20px] py-[16px] rounded-md"
            >
              <Image
                src={`img/${tab}.svg`}
                alt={`${tab} icon`}
                className="mr-[10px]"
                width={16}
                height={16}
              />
              <span className="font-poppins text-[14px] font-medium">
                {tab}
              </span>
            </div>
          ))}

          <button
            onClick={() => setAddTabStatus(!addTabStatus)}
            className={`p-4 transition pointer flex items-center ml-auto ${
              addTabStatus ? "bg-[#A7C8FF]" : "bg-[#FEFEFE]"
            }`}
          >
            <Image
              src={addTabStatus ? "img/more-active.svg" : "img/more.svg"}
              alt="more-icon"
              width={16}
              height={16}
            />
          </button>
        </div>

        {addTabStatus && (
          <ul className="bg-white shadow-md rounded-md w-60 absolute right-0 top-29 z-10 border border-[#AEB6CE33]">
            {tabs
              .filter((tab) => !activeTabs.includes(tab))
              .map((tab, index) => (
                <li
                  key={index}
                  onClick={() => addTab(tab)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-[#7F858D]"
                >
                  <div className="flex flex-row items-center">
                    <Image
                      src={`img/${tab}.svg`}
                      alt={`${tab} icon`}
                      className="mr-[10px]"
                      width={16}
                      height={16}
                    />
                    {tab}
                  </div>
                </li>
              ))}
          </ul>
        )}
        <div className="h-[610px] bg-white border-20 border-[#F4F7F9]" />
      </div>
    </div>
  );
};

export default TabList;
