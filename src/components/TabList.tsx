import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DropResult } from "react-beautiful-dnd";

const TabList: React.FC = () => {
  const tabs = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Banking", href: "#banking" },
    { name: "Telefonie", href: "#telefonie" },
    { name: "Accounting", href: "#accounting" },
    { name: "Verkauf", href: "#verkauf" },
    { name: "Statistik", href: "#statistik" },
    { name: "Post Office", href: "#post-office" },
    { name: "Administration", href: "#administration" },
    { name: "Help", href: "#help" },
    { name: "Warenbestand", href: "#warenbestand" },
    { name: "Auswahllisten", href: "#auswahllisten" },
    { name: "Einkauf", href: "#einkauf" },
    { name: "Rechn", href: "#rechn" },
  ];

  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [pinnedTabs, setPinnedTabs] = useState<string[]>([]);
  const [addTabStatus, setAddTabStatus] = useState(false);
  const [contextMenuTab, setContextMenuTab] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const router = useRouter();

  useEffect(() => {
    const savedActiveTabs = localStorage.getItem("activeTabs");
    const savedPinnedTabs = localStorage.getItem("pinnedTabs");

    if (savedActiveTabs) {
      setActiveTabs(JSON.parse(savedActiveTabs));
    }
    if (savedPinnedTabs) {
      setPinnedTabs(JSON.parse(savedPinnedTabs));
    }
  }, []);

  useEffect(() => {
    if (activeTabs.length > 0) {
      localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
    } else {
      localStorage.removeItem("activeTabs");
    }
    if (pinnedTabs.length > 0) {
      localStorage.setItem("pinnedTabs", JSON.stringify(pinnedTabs));
    } else {
      localStorage.removeItem("pinnedTabs");
    }
  }, [activeTabs, pinnedTabs]);

  const addTab = (tab: string) => {
    if (
      activeTabs.length + pinnedTabs.length < 10 &&
      !activeTabs.includes(tab) &&
      !pinnedTabs.includes(tab)
    ) {
      setActiveTabs((prevTabs) => [...prevTabs, tab]);
      setAddTabStatus(false);
    }
  };

  const removeTab = (tab: string) => {
    setActiveTabs((prevTabs) => prevTabs.filter((t) => t !== tab));
  };

  const pinTab = (tab: string) => {
    if (!pinnedTabs.includes(tab)) {
      setActiveTabs((prevTabs) => prevTabs.filter((t) => t !== tab));
      setPinnedTabs((prev) => [tab, ...prev]);
    }
  };

  const unpinTab = (tab: string) => {
    setPinnedTabs((prev) => prev.filter((t) => t !== tab));
    addTab(tab);
  };

  const handleTabClick = (href: string) => {
    router.push(href, undefined, { shallow: true });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(activeTabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveTabs(items);
  };

  const handleContextMenu = (tab: string, event: React.MouseEvent) => {
    event.preventDefault();

    const { clientX, clientY } = event;

    setContextMenuTab(tab);
    setMenuPosition({
      top: clientY + 20,
      left: clientX + 6,
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-[62px] bg-[#FFFFFF]" />
      <div className="flex-1 relative">
        <div className="w-full h-[69px] border border-[#AEB6CE33]" />

        <div className="flex items-center space-x-4">
          <div className="px-[20px] py-[16px] m-0">
            <Image
              src={"img/Lagerverwaltung.svg"}
              alt="lagerverwaltung"
              width={16}
              height={16}
            />
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tabs" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex"
                >
                  {pinnedTabs.map((tab, index) => (
                    <Draggable key={tab} draggableId={tab} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center px-[20px] py-[16px] m-0 cursor-pointer bg-[#F4F7F9] text-[#000000] border-t-2 ${
                            activeTabs.includes(tab)
                              ? "border-[#4690E2]"
                              : "border-[#E0E0E0]"
                          }`}
                          onClick={() =>
                            handleTabClick(
                              tabs.find((t) => t.name === tab)?.href ?? "#"
                            )
                          }
                          onContextMenu={(e) => handleContextMenu(tab, e)}
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
                          <button
                            onClick={() => unpinTab(tab)}
                            className="ml-[7px] cursor-pointer"
                          >
                            <Image
                              src={"img/anpinnen.svg"}
                              alt="unpin"
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {activeTabs.map((tab, index) => (
                    <Draggable key={tab} draggableId={tab} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center px-[20px] py-[16px] m-0 cursor-pointer ${
                            router.asPath.includes(
                              tabs.find((t) => t.name === tab)?.href ?? ""
                            )
                              ? "bg-[#F4F7F9] text-[#000000] border-t-2 border-[#4690E2]"
                              : "bg-[#FEFEFE] text-[#7F858D]"
                          } hover:bg-[#F4F7F9] hover:text-[#000000]`}
                          onClick={() =>
                            handleTabClick(
                              tabs.find((t) => t.name === tab)?.href ?? "#"
                            )
                          }
                          onContextMenu={(e) => handleContextMenu(tab, e)}
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

                          {router.asPath.includes(
                            tabs.find((t) => t.name === tab)?.href ?? ""
                          ) && (
                            <button onClick={() => removeTab(tab)}>
                              <Image
                                src={"img/delete.svg"}
                                alt="delete"
                                width={16}
                                height={16}
                                className="ml-[7px] cursor-pointer"
                              />
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

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
              .filter(
                (tab) =>
                  !activeTabs.includes(tab.name) &&
                  !pinnedTabs.includes(tab.name)
              )
              .map((tab, index) => (
                <li
                  key={index}
                  onClick={() => addTab(tab.name)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-[#7F858D]"
                >
                  <div className="flex flex-row items-center">
                    <Image
                      src={`img/${tab.name}.svg`}
                      alt={`${tab.name} icon`}
                      className="mr-[10px]"
                      width={16}
                      height={16}
                    />
                    {tab.name}
                  </div>
                </li>
              ))}
          </ul>
        )}

        {contextMenuTab && (
          <div
            className="absolute bg-white shadow-md w-[155] z-10 border border-[#AEB6CE33]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            {!pinnedTabs.includes(contextMenuTab) && (
              <button
                onClick={() => pinTab(contextMenuTab)}
                className="w-full px-4 py-2 flex items-center text-[#4690E2] hover:bg-gray-100"
              >
                <Image
                  src="img/anpinnen.svg"
                  alt="pin"
                  width={16}
                  height={16}
                  className="mr-[10px]"
                />
                Tab anpinnen
              </button>
            )}
          </div>
        )}

        <div className="h-[610px] bg-white border-20 border-[#F4F7F9]" />
      </div>
    </div>
  );
};

export default TabList;
