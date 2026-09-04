import type { en } from "./en";

/**
 * The page in Vietnamese.
 *
 * Typed as `typeof en`, so a key that goes missing or gets renamed on one side is
 * a build error rather than a hole someone finds in production.
 *
 * Two rules this translation follows.
 *
 * Technical vocabulary stays English where that is what Vietnamese engineers
 * actually say: agent, workflow, model, prompt, script, SDK, MCP, session,
 * console. Rendering `agent` as "tác tử" would be more Vietnamese and less
 * intelligible to the exact person this page is written for, and the audience —
 * "bring the questions you'd ask before running something like this yourself" —
 * is that person.
 *
 * The crafted headlines are rewritten, not translated. "The stuck one finds you"
 * carries an inversion — the thing you were failing to find now comes to you —
 * and a literal rendering loses it. Each of these was written again in Vietnamese
 * to make the same point with the same economy, which occasionally means a
 * different image ("In plain sight" becomes "Không còn chỗ khuất", because the
 * section it answers is called the blind spot).
 */
export const vi: typeof en = {
  meta: {
    title: "LAAM — Mọi agent, mọi máy, hết chỗ khuất",
    description:
      "LAAM giám sát những AI agent vốn đã chạy trên máy của đội bạn, và đặt thêm một trợ lý cùng hệ tự động hoá workflow bền bỉ lên cùng màn hình — chạy trên model cục bộ thì không phát sinh đồng chi phí model nào.",
  },

  langToggle: { label: "English", aria: "View this page in English" },

  nav: {
    links: [
      { href: "#watch", label: "Nó theo dõi gì" },
      { href: "#surfaces", label: "Các mặt làm việc" },
      { href: "#evidence", label: "Bằng chứng" },
      { href: "#status", label: "Đang ở đâu" },
    ],
    cta: "Đặt lịch xem demo",
  },

  boot: {
    calibrating: "đang hiệu chỉnh lưới đo",
    mounting: "đang nạp bộ đọc bản ghi",
    hosts: (n: number) => `đang dò máy · ${n} host`,
    channels: (n: number) => `kênh telemetry ${n}/${n} đã lên`,
  },

  hero: {
    eyebrows: ["Ưu tiên cục bộ", "$0 với model cục bộ", "Không cần gắn đo đạc"],
    headline: ["Mọi agent.", "Mọi máy.", "Hết chỗ khuất."],
    lead: {
      ink: "LAAM đọc chính những bản ghi mà agent Claude Code của bạn vốn đã tự sinh ra.",
      rest: "Không sửa SDK, không bọc thêm lớp nào, không đụng gì tới agent — mỗi máy chỉ cần một script không phụ thuộc để đẩy bản ghi về. Rồi nó đặt một trợ lý và hệ tự động hoá workflow bền bỉ lên cùng một màn hình.",
    },
    actions: { primary: "Đặt lịch xem demo", secondary: "Xem nó theo dõi gì" },
    scopeCaption: "Bản đồ trợ lý — mọi mặt làm việc trên một lõi",
  },

  problem: {
    eyebrow: "Vì sao các đội tìm đến nó",
    heading: "Hỏng ở đâu khi agent đông hơn người vận hành",
    items: [
      {
        route: "điểm mù",
        title: "Agent chạy khắp nơi, không ai nhìn thấy",
        body: "Cả chục phiên Claude Code trên bốn máy. Một con kẹt đã bốn mươi phút. Bạn chỉ biết khi có người hỏi sao nhánh đó mãi chưa vào.",
        answeredBy: "Bộ đọc bản ghi",
      },
      {
        route: "đồng hồ tính tiền",
        title: "Câu hỏi vặt nào cũng tính tiền model đắt nhất",
        body: "Tóm tắt, tra cứu, sửa lại một dòng — những việc thường ngày đáng lẽ không cần gọi API trả phí, vẫn bị tính như thể có. Rồi khi hoá đơn về, chẳng có gì quy nó về được model nào, phiên nào hay nhánh nào.",
        answeredBy: "Trợ lý, và quy chi phí",
      },
      {
        route: "việc vặt",
        title: "Việc vặt qua nhiều app vẫn phải làm tay",
        body: "Đọc dữ liệu, tóm tắt lại, gửi mail, đăng lên Slack, cập nhật ticket. Năm công cụ, lần nào cũng vậy, làm tay hết.",
        answeredBy: "Tự động hoá workflow",
      },
    ],
    answer: {
      eyebrow: "Lời giải",
      ink: "Ba vấn đề, ba lời giải, một màn hình.",
      rest: "Điểm mù được đóng lại từ chính những bản ghi mà agent của bạn vốn đã ghi xuống đĩa — chỉ cần trỏ vào một máy là nó bắt đầu báo cáo, không phải thêm gì ở phía agent. Hai vấn đề còn lại được giải bằng thứ nằm ngay cạnh bảng theo dõi đó: một trợ lý bạn hỏi mà không phải bật đồng hồ tính tiền của model đắt, và hệ tự động hoá chạy chuỗi năm công cụ kia đúng một lần.",
    },
  },

  channels: {
    eyebrow: "Nền tảng",
    heading: "Bảy kênh, một console",
    lead: "Mỗi bảng bên dưới là một mặt làm việc người ta mở hằng ngày — đã ship, không phải kế hoạch. Dữ liệu trong đó là dữ liệu dựng; phiên thật thuộc về người đang đăng nhập.",
    items: [
      {
        title: "Con đang kẹt tự tìm đến bạn",
        body: "Mọi phiên từ mọi máy, truyền về qua SSE. Bóc tách orchestrator xuống sub-agent, dòng thời gian các lần gọi tool, và cờ báo phiên kẹt bật lên ngay khi có cập nhật kế tiếp.",
        points: [
          "Orchestrator → bóc tách sub-agent",
          "Lọc theo project, model, branch, máy",
          "Ngưỡng báo agent kẹt tuỳ chỉnh được",
          "Chi phí theo model và theo ngày, kèm lượng token theo project",
          "Tool chậm nhất và tỉ lệ lỗi cao nhất, tự nổi lên",
        ],
      },
      {
        title: "Trợ lý bạn chạy được mà không tốn đồng nào",
        body: "Chạy trên model cục bộ thì mọi câu trả lời đều miễn phí — nó vẫn với tới được mọi tool trên trang này. Cắm thêm key BytePlus thì vẫn trợ lý đó, vẫn bộ tool đó, chỉ là trả lời bằng model đặt trên cloud.",
        points: [
          "Vision, PDF/DOCX, OCR (vi/en/zh)",
          "Tìm kiếm web qua SearXNG tự dựng",
          "Tra toạ độ, thời tiết và địa điểm quanh đây",
          "Xuất ra Markdown, JSON, PDF",
        ],
      },
      {
        title: "Rảnh tay, nói là chạy",
        body: "Console giọng nói toàn màn hình. TTS neural đọc phần tường thuật theo luồng; bảng biểu và biểu đồ hiện lên một panel nổi thay vì bị đọc vanh vách.",
        points: [
          "Vòng nghe → trả lời → nghe liên tục",
          "Xem lại bản ghi ngay tại chỗ",
          "Nhận giọng nói hiện dùng của trình duyệt, nên cần Chrome",
        ],
      },
      {
        title: "Mọi thao tác không thể hoàn tác đều dừng chờ bạn",
        body: "Node connector, agent, condition, foreach và MCP trên cùng một canvas. Lần chạy sống sót qua sự cố, tiếp tục được từ đúng node đang dở, và hẹn giờ được. Mô tả công việc trong khung chat rồi trợ lý dựng ra đồ thị — sau đó chạy thử với dữ liệu thật và đưa kết quả ngược lại để model tự sửa đồ thị của nó.",
        points: [
          "DAG song song — toả ra, gộp lại",
          "Lúc trợ lý đang dựng, không thao tác ghi nào bắn đi — chúng thành node",
          "Chat thì xác nhận, chạy thật thì chặn mặc định, gửi đi thì theo danh sách cho phép",
          "Preset agent riêng, lưu một lần rồi dùng lại ở mọi đồ thị",
          "Huỷ giữa chừng, mẫu dựng sẵn, nhân bản",
        ],
      },
      {
        title: "Chín dịch vụ, cộng bất cứ thứ gì nói được MCP",
        body: "GitHub, Jira, Trello, Drive, Calendar, Gmail, Slack, WhatsApp và Zalo OA — phần lớn chỉ cần một cú bấm để cấp quyền. Máy chủ MCP bên ngoài nào cũng gắn được, theo từng người dùng.",
        points: ["Tool ghi luôn có cổng chặn, không bao giờ âm thầm", "Thông tin đăng nhập mã hoá riêng từng người"],
      },
      {
        title: "Tìm lại lần chạy bạn chỉ nhớ mang máng",
        body: "Một câu truy vấn quét cả phiên, hội thoại và workflow. Phiên thì chia sẻ với cả đội; hội thoại và workflow của bạn chỉ trả về cho riêng bạn, dưới dạng con trỏ chứ không phải trích đoạn.",
        points: ["Chỉ mục trigram — tiếng Việt, tiếng Anh, 中文"],
      },
      {
        title: "Phân quyền trụ được khi có người nghỉ việc",
        body: "Bốn vai trò, chặn ngay ở tầng route. Ai cũng tự quản key của mình; chủ sở hữu có thể cấp và thu hồi thay người khác, và mọi lần cấp đều được ghi lại.",
        points: ["Mã hoá thông tin đăng nhập theo từng người (HKDF)", "Giới hạn tần suất và khoá tài khoản"],
      },
    ],
  },

  evidence: {
    eyebrow: "Đo được, không phải tự nhận",
    heading: "Ngồi suy luận sẽ bỏ sót cả ba",
    lead: {
      ink: "Cả ba đều lộ ra khi đem sản phẩm chạy với cơ sở dữ liệu thật, chứ không phải khi ngồi suy luận về nó.",
      rest: "Truy đúng nguyên nhân, sửa, rồi đo lại — chính vòng lặp đó là lý do để tin những gì còn lại trên trang này.",
    },
    cards: [
      {
        measure: "mức tuân thủ chỉ dẫn",
        caption: "chỉ dẫn tĩnh được làm theo",
        after: "đã kiểm chứng trọn vẹn một lần",
        title: "Cho model thấy hơn là bảo model làm — và chúng tôi chứng minh được",
        body: "Những quy tắc viết sẵn trong prompt dựng workflow tốt nhất cũng chỉ trúng ba trên mười lăm lần. Đem đồ thị nháp chạy thử với dữ liệu thật rồi đưa kết quả ngược vào cuộc hội thoại thì model tự sửa được đồ thị của chính nó, dựa trên thứ nó thực sự nhìn thấy — đã kiểm chứng một lần, chạy trọn đường, với dữ liệu thật chứ không phải dữ liệu giả lập.",
      },
      {
        measure: "giá trị bị ghi cứng",
        caption: "id thật bị chép vào đồ thị đã lưu",
        after: "chỉ giấu id, không giấu tất cả",
        title: "Bài học cả ngành cứ phải học lại — và học tới hai lần",
        body: "Trong lúc dò tool, model nhìn thấy một query id thật rồi dán thẳng nó vào workflow đã lưu như một hằng số, và hỏng ngay lần chạy kế tiếp: id đó chỉ có hiệu lực đúng cho lần dò ấy. Giấu sạch mọi giá trị thì sửa được lỗi này nhưng làm hỏng chỗ khác — bảng dò không còn phân biệt nổi bốn truy vấn na ná nhau. Nên giờ nó giấu đúng thứ sẽ hết hạn là id và UUID, còn vẫn in ra những tham số giúp phân biệt lần gọi này với lần gọi kia.",
      },
      {
        measure: "lượt voice không tra cứu",
        caption: "trước khi tách prompt",
        after: "0 trên 12 sau khi sửa",
        title: "Tìm ra lỗi prompt một dòng bằng cách đo, không phải đoán",
        body: "Voice hỏng 3 trên 17 lượt trong khi cùng những câu đó hỏi bằng chữ thì hỏng 0 trên 6. Câu \"ưu tiên ngắn gọn\" đang bị hiểu thành chỉ thị kiểm tra ít lại, chứ không phải nói ngắn lại. Tách bạch cách trình bày ra khỏi mức độ phải tra cứu là về không.",
      },
    ],
    measurement: {
      eyebrow: "Đo bằng cách nào",
      note: "Chạy lại ở mỗi bản phát hành",
      suites: [
        {
          name: "Bộ đo hành vi",
          scale: "17 kịch bản × 5 lượt",
          body: "Mỗi kịch bản chạy lại năm lần và chấm theo từng chiều thay vì đạt/không đạt, nên một lượt ra đúng đáp án bằng đường sai vẫn lộ ra.",
          tags: [
            "chọn tool",
            "tham số",
            "bám dữ liệu",
            "biết kiềm chế",
            "biết dừng",
            "ý định ghi",
            "khối nội dung",
          ],
        },
        {
          name: "Chọn tool ở quy mô thật",
          scale: "hợp 60 tool · k=8",
          body: "Mỗi phép dò được trả lời trên một tập hợp rút từ toàn bộ pool production, vì chọn đúng tool trong sáu cái chẳng chứng minh được gì về việc chọn đúng trong sáu mươi.",
          tags: ["12 nội bộ", "42 connector", "48 MCP"],
        },
      ],
      footer: {
        ink: "Bản thân điểm số là một phần của buổi demo.",
        rest: "Đó là những lần chạy có ngày tháng, trên một model có tên, gồm cả những dòng điểm thấp — thứ đáng để trao đổi khi có người ngồi đó, và là thứ tệ nếu bỏ lại trên một trang web dưới dạng con số không kèm lý do.",
      },
    },
  },

  status: {
    eyebrow: "Đang ở đâu",
    heading: "Công cụ nội bộ, dùng hằng ngày",
    lead: {
      ink: "LAAM được làm cho chính kỹ sư của chúng tôi và chạy trên chính máy của chúng tôi.",
      rest: "Nó không phải sản phẩm dạng dịch vụ và chúng tôi không giả vờ ngược lại — thứ chúng tôi cho bạn xem được là một hệ thống đang chạy, những quyết định đằng sau nó, và cần những gì để dựng một cái như vậy cho đội bạn.",
    },
    facts: [
      { label: "Phiên bản", value: "v2.5.0" },
      { label: "Chi phí model cục bộ", value: "$0" },
      { label: "Connector", value: "9 + MCP" },
      { label: "Phải sửa agent", value: "Không" },
    ],
    nextLabel: "Sắp tới",
    ahead: [
      "Nhật ký kiểm toán phủ rộng hơn thao tác ghi, cấp token và đổi vai trò",
      "Vision chạy được trên nhánh model cloud, không chỉ nhánh cục bộ",
      "Nhận giọng nói tự dựng, để voice thôi phụ thuộc Chrome",
    ],
  },

  contact: {
    eyebrow: "Nói chuyện với chính đội đã làm ra nó",
    heading: "Chúng tôi mở console thật cho bạn xem",
    lead: {
      ink: "Bốn mươi phút, phiên thật, workflow thật",
      rest: "— gồm cả những phần còn nằm trong kế hoạch. Cứ mang theo những câu bạn sẽ hỏi trước khi tự vận hành một thứ như thế này.",
    },
    primary: "Đặt lịch xem demo",
    secondary: "Về đầu trang",
    mailSubject: "Đặt lịch xem demo LAAM",
  },

  footer: { wordmark: "LAAM — Local AI Agent Monitoring", org: "Nền tảng nội bộ" },

  skipToContent: "Bỏ qua, tới nội dung chính",
};
