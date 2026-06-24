const brands = [
  "WeCloudData",
  "SDA",
  "LinkedIn",
  "GitHub",
  "InOne",
];

export default function Brands() {
  return (
    <section className="brands">
      <div className="track">
        {[...brands, ...brands, ...brands].map((b, i) => (
          <div className="item" key={i}>
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}