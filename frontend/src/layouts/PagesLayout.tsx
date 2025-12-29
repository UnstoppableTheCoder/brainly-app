import { Outlet } from "react-router";
import ContentModal from "../components/modals/content/ContentModal";
import ShareModal from "../components/modals/share/ShareModal";
import ContentsProvider from "../contexts/content/ContentsProvider";

const PagesLayout = () => {
  return (
    <>
      <ContentsProvider needsLogIn={true}>
        <Outlet />

        <ContentModal type="add" modalId="content_add_modal" />
        <ShareModal modalId="share_link_modal" />
      </ContentsProvider>
    </>
  );
};

export default PagesLayout;
