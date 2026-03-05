import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BrandedErrorPage from "@/components/BrandedErrorPage";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 route:", location.pathname);
  }, [location.pathname]);

  return (
    <BrandedErrorPage
      code="404"
      title="페이지를 찾을 수 없습니다."
      description="주소가 변경되었거나 삭제된 페이지입니다. 홈 또는 이전 페이지로 이동해 주세요."
      detail={`요청 경로: ${location.pathname}`}
      primaryActionLabel="이전 페이지"
      onPrimaryAction={() => window.history.back()}
      showBackButton={false}
    />
  );
};

export default NotFound;
