import { Tabs } from "antd";
import useStore from "@/store";

export default function PortalContent({ children }) {
  const { tabList, activeKey, setActiveKey, removeTabList } = useStore();

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onEdit = (key: string, action: string) => {
    if (action === "remove") {
      removeTabList(key);
    }
  };
  return (
    <div className="portal-content">
      <Tabs
        hideAdd
        type="editable-card"
        defaultActiveKey="IMAS_Index"
        activeKey={activeKey}
        items={tabList}
        onChange={onChange}
        onEdit={onEdit}
      />
      {children}
    </div>
  );
}
