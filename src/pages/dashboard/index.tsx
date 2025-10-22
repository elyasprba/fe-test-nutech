import { Flex, Layout } from "antd";
import ServiceList from "../../components/service-list";
import Navbar from "../../components/navbar";
import { useGetBanner } from "../../api/benner";
import BannerSlider from "../../components/banner";
import ProfileBalanceCard from "../../components/profile-balance-card";

const { Content, Footer } = Layout;

const contentStyle: React.CSSProperties = {
  color: "#000",
  backgroundColor: "#fff",
  paddingInline: 300,
};

const footerStyle: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#F4271A",
  paddingInline: 150,
};

const layoutStyle = {
  overflow: "hidden",
};

function Dashboard() {
  const { data: bannerData } = useGetBanner();

  return (
    <>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Navbar />

          <Content style={contentStyle} className="min-h-screen py-5">
            <ProfileBalanceCard />

            <div className="pt-10">
              <h3 className="text-lg text-slate-500 font-semibold pb-4">
                Temukan promo menarik
              </h3>
              <BannerSlider banners={bannerData || []} />
            </div>

            <div className="py-10">
              <ServiceList />
            </div>
          </Content>

          <Footer style={footerStyle}>
            <div className="text-center text-white">
              &copy; 2025 SIMS PPOB - Elyas Purba prastiya. All rights reserved.
            </div>
          </Footer>
        </Layout>
      </Flex>
    </>
  );
}

export default Dashboard;
