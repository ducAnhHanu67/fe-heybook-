export default function Footer() {
  return (
    <footer className="copy-r w-full float-left bg-[#f3f3f3]">
      <div className="max-w-7xl mx-auto px-4">
        <p className="w-full float-left font-light italic text-[12px] text-center leading-[30px]">
          Công ty TNHH ROBOTICSWORLD GPĐKKD:{" "}
          <span className="font-semibold not-italic">0109965380</span> do SKH & ĐT TP Hà Nội
          cấp ngày 14/04/2022. Địa chỉ số 34 Trần Đăng Ninh, Dịch Vọng, Cầu Giấy, Hà Nội
        </p>
        <p className="w-full float-left font-light italic text-[12px] text-center leading-[30px]">
          Điện thoại:{" "}
          <span className="font-semibold not-italic text-black">0936 020 386</span> - Email:{" "}
          <a
            href="mailto:support@techzhome.vn"
            className="text-blue-600 hover:underline not-italic"
          >
            support@techzhome.vn
          </a>
        </p>
      </div>
    </footer>
  );
}
