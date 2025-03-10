import { useTabs } from "@/hooks/useTabs";
import { useRouter } from "next/router";
import { useState } from "react";
import { tabs } from "@/data/tabsData";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DropResult } from "react-beautiful-dnd";

import Image from "next/image";

const TabList: React.FC = () => {
  const [contextMenuTab, setContextMenuTab] = useState<string | null>(null);
  const router = useRouter();
  const {
    activeTabs,
    setActiveTabs,
    pinnedTabs,
    addTabStatus,
    addTab,
    removeTab,
    pinTab,
    unpinTab,
    setAddTabStatus,
  } = useTabs();

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
    setContextMenuTab(tab);
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
                                className="cursor-pointer ml-[7px]"
                              />
                            </button>
                          )}

                          {contextMenuTab &&
                            router.asPath.includes(
                              tabs.find((t) => t.name === tab)?.href ?? ""
                            ) && (
                              <div>
                                {!pinnedTabs.includes(contextMenuTab) && (
                                  <button
                                    onClick={() => pinTab(contextMenuTab)}
                                    className="w-full flex items-center hover:bg-gray-100 ml-[7px]"
                                  >
                                    <Image
                                      src="img/anpinnen.svg"
                                      alt="pin"
                                      width={16}
                                      height={16}
                                    />
                                  </button>
                                )}
                              </div>
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

        <div className="h-[610px] bg-white border-20 border-[#F4F7F9]" />
      </div>
    </div>
  );
};

export default TabList;
