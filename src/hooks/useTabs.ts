import { useEffect, useState } from "react";

export const useTabs = () => {
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [pinnedTabs, setPinnedTabs] = useState<string[]>([]);
  const [addTabStatus, setAddTabStatus] = useState(false);

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

  return {
    activeTabs,
    setActiveTabs,
    pinnedTabs,
    addTabStatus,
    addTab,
    removeTab,
    pinTab,
    unpinTab,
    setAddTabStatus,
  };
};
