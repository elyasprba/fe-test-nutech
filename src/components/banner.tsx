import { Row, Col } from "antd";

interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

function BannerSlider({ banners }: { banners: Banner[] }) {
  if (!banners || banners.length === 0) return null;

  const [mainBanner, ...smallBanners] = banners;

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <img
            src={mainBanner.banner_image}
            alt={mainBanner.banner_name}
            className="w-full h-full object-cover rounded-xl"
          />
        </Col>

        <Col span={12}>
          <Row gutter={[12, 12]}>
            {smallBanners.map((banner) => (
              <Col key={banner.banner_name} span={12}>
                <img
                  src={banner.banner_image}
                  alt={banner.banner_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default BannerSlider;
