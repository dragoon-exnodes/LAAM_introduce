import type { en } from "./en";

/**
 * The page in Vietnamese.
 *
 * Typed as `typeof en`, so a key that goes missing or gets renamed on one side is
 * a build error rather than a hole someone finds in production.
 *
 * Two rules this translation follows.
 *
 * Technical vocabulary stays English where that is what a Vietnamese reader
 * actually says: workflow, model, connector, MCP, console, project.
 * Note the ceiling on this, though — the page now addresses business owners,
 * not the engineers it was first written for, so anything that CAN be said in
 * Vietnamese is: "lượt tra" not "lookup", "cổng xác nhận" not "write gate".
 * English is a last resort here, where it used to be a convenience.
 *
 * The crafted headlines are rewritten, not translated. Each was written again
 * in Vietnamese to make the same point with the same economy, which sometimes
 * means a different image — the English hero turns on "answers back", which has
 * no Vietnamese equivalent that fits three short lines, so the Vietnamese turns
 * on "giờ biết trả lời" instead: the data has learned to answer.
 */
export const vi: typeof en = {
  meta: {
    title: "LAAM — Hệ thống công ty bạn, giờ biết trả lời",
    description:
      "Hỏi dữ liệu của chính bạn như hỏi một đồng nghiệp — không SQL, không phải đặt yêu cầu báo cáo, không phải chờ. LAAM tự tra số liệu thật để trả lời, rồi chạy nốt phần việc nhiều bước phía sau. Chạy trên máy của bạn; với model cục bộ, không câu hỏi nào bị tính tiền.",
  },

  langToggle: { label: "English", aria: "View this page in English" },

  nav: {
    links: [
      { href: "#why", label: "Vì sao nên dùng" },
      { href: "#surfaces", label: "Các mặt làm việc" },
      { href: "#evidence", label: "Bằng chứng" },
      { href: "#status", label: "Đang ở đâu" },
    ],
    cta: "Đặt lịch xem demo",
  },

  boot: {
    calibrating: "đang khởi động console",
    mounting: "đang mở trợ lý",
    sources: (n: number) => `đang nối nguồn · ${n} nguồn đã nối`,
    channels: (n: number) => `${n}/${n} mặt làm việc đã sẵn sàng`,
  },

  hero: {
    eyebrows: ["Chạy trên máy của bạn", "Không tính tiền theo câu hỏi", "Hỏi bằng tiếng Việt"],
    // Ba mục = ba dòng, không mục nào được xuống dòng: mỗi mục là một khung
    // overflow-hidden riêng mà animation trượt lên, nên một mục vỡ dòng làm cả hero
    // cao thêm và đẩy dải băng ra khỏi màn hình đầu. "Hệ thống công ty bạn," vỡ hai
    // dòng ở khổ desktop, và "Hệ thống của bạn," cũng vậy. Đo thật: cột rộng 634px,
    // mà cụm đó cần 723px. Cách chia này giữ đủ chữ và cả ba dòng đều lọt (540 /
    // 480 / 607). Sửa chỗ này thì ĐO lại, đừng ước lượng bằng số ký tự — chữ hoa
    // tiếng Việt có dấu rộng hơn tiếng Anh nhiều.
    headline: ["Hệ thống của", "công ty bạn", "giờ biết trả lời."],
    lead: {
      ink: "Cứ hỏi như hỏi một đồng nghiệp — không cần biết tên bảng, tên cột, hay một chữ SQL nào.",
      rest: "Nó với tới database, kho tài liệu và các hệ thống công ty bạn đang chạy — một phần mềm bán hàng, một hệ đặt lịch, một dịch vụ nội bộ — tra số liệu thật để trả lời, rồi làm nốt phần việc phía sau. Câu nào có thể hiểu hai cách thì nó hỏi lại bạn thay vì đoán bừa. Chạy trên máy của bạn — dữ liệu không đi đâu cả.",
    },
    actions: { primary: "Đặt lịch xem demo", secondary: "Xem nó trả lời thế nào" },
    scopeCaption: "Bản đồ trợ lý · dữ liệu minh hoạ",
    phases: { idle: "sẵn sàng", thinking: "đang tra cứu", speaking: "đang trả lời" },
    lookupLabel: "lượt tra",
    sourceLabel: "nguồn",
    costLabel: "chi phí",
  },

  inquiries: {
    states: { answered: "đã trả lời", clarified: "hỏi lại", held: "chờ xác nhận" },
    stepsSuffix: "lượt tra",
    items: [
      { domain: "bán lẻ", question: "Tháng này cửa hàng nào doanh thu giảm mạnh nhất?" },
      { domain: "kho vận", question: "Còn bao nhiêu đơn quá hạn giao chưa xử lý?" },
      { domain: "nhân sự", question: "Quý này ai làm thêm giờ nhiều nhất?" },
      { domain: "dược phẩm", question: "Nhân viên nào hoàn tiền nhiều nhất?" },
      { domain: "hợp đồng", question: "Hợp đồng với nhà cung cấp này chốt báo trước bao nhiêu ngày?" },
      { domain: "đặt lịch", question: "Đặt lại hai khung giờ khách bỏ hôm qua và nhắn cho khách." },
    ],
  },

  problem: {
    eyebrow: "Vì sao các đội tìm đến nó",
    heading: "Cái gì đứng giữa câu hỏi và câu trả lời",
    items: [
      {
        route: "phải xếp hàng",
        title: "Câu hỏi nào cũng phải chờ người khác",
        body: "\"Tháng này ai hoàn tiền nhiều nhất?\" là câu hỏi mười giây. Nhưng nó phải xếp hàng sau người biết viết query, rồi quay về dưới dạng một file Excel đã cũ một ngày.",
        answeredBy: "Hỏi bằng lời thường",
      },
      {
        route: "việc lặp",
        title: "Vẫn chuỗi việc đó, làm tay, mỗi tuần",
        body: "Đọc số liệu, tóm tắt lại, gửi mail cho quản lý, đăng lên nhóm, cập nhật phiếu. Năm công cụ, tuần nào cũng vậy, một người ngồi làm.",
        answeredBy: "Tự động hoá workflow",
      },
      {
        route: "phải tin mù",
        title: "Giao việc cho AI mà không kiểm được",
        body: "Con số đó lấy ở đâu ra, nó đã gọi công cụ nào, suýt gửi cái gì cho ai. Không trả lời được mấy câu đó thì chẳng ai tỉnh táo lại cho nó đụng vào dữ liệu thật.",
        answeredBy: "Cổng xác nhận, và toàn bộ nhật ký",
      },
    ],
    answer: {
      eyebrow: "Lời giải",
      ink: "Ba vấn đề, ba lời giải, một màn hình.",
      rest: "Hàng đợi biến mất vì câu hỏi đi thẳng vào dữ liệu — và khi câu hỏi thật sự có nhiều cách hiểu, nó hỏi lại bạn thay vì đoán bừa. Chuỗi việc lặp chỉ cần mô tả một lần rồi tự chạy. Còn thứ gì không thể hoàn tác thì không xảy ra nếu bạn chưa xác nhận, trên một nhật ký bạn đọc lại được sau đó.",
    },
  },

  channels: {
    eyebrow: "Nền tảng",
    heading: "Bảy mặt làm việc, một console",
    lead: "Mỗi bảng bên dưới là một mặt làm việc người ta mở hằng ngày — đã ship, không phải kế hoạch. Dữ liệu trong đó là dữ liệu dựng; dữ liệu thật thuộc về người đang đăng nhập.",
    items: [
      {
        title: "Nó đã làm gì, sau đó không còn là bí ẩn",
        body: "Mọi thứ trợ lý chạy, từ mọi máy, truyền về ngay khi đang diễn ra: nó gọi công cụ nào và theo thứ tự nào, mỗi bước mất bao lâu, tốn bao nhiêu, và cờ báo lên ở bất cứ lần chạy nào không còn nhúc nhích.",
        points: [
          "Lần theo từng công cụ trong một lượt chạy",
          "Mỗi câu trả lời truy được về đúng số liệu đã đọc",
          "Thao tác ghi bị giữ lại chờ xác nhận, kèm người nhận",
          "Cảnh báo khi một lần chạy đứng im",
          "Tốn bao nhiêu, theo model và theo ngày",
        ],
      },
      {
        title: "Những câu hỏi hằng ngày, trả lời ngay tại chỗ",
        body: "Hỏi nó về số liệu của chính bạn, đưa nó một file PDF hay tấm ảnh chụp phiếu giao hàng, nhờ nó tra giúp một thứ trên web — nó trả lời từ nguồn thật chứ không phải từ trí nhớ. Chạy bằng model đặt ngay trên máy bạn thì từng câu trả lời như vậy không tốn đồng nào; cắm thêm model trên cloud thì vẫn trợ lý đó, vẫn với tới từng ấy thứ.",
        points: [
          "Đọc ảnh, bản scan, file PDF và Word (vi/en/zh)",
          "Tìm trên web qua máy chủ tìm kiếm của chính bạn",
          "Tra địa chỉ, thời tiết và địa điểm quanh đây",
          "Lưu câu trả lời thành PDF để gửi đi",
        ],
      },
      {
        title: "Bận tay thì cứ hỏi bằng miệng",
        body: "Một màn hình toàn cảnh bạn nói chuyện thẳng với nó. Nó đọc câu trả lời ngay khi đang trả lời, còn bảng biểu và biểu đồ thì hiện lên một panel bên cạnh thay vì đọc vanh vách từng con số — nên bạn đang đứng ở quầy hay đi trong kho vẫn nhận được câu trả lời gọn ghẽ.",
        points: [
          "Nó nghe liên tục, cứ hỏi tiếp là được",
          "Xem lại bản ghi ngay tại chỗ",
          "Nhận giọng nói hiện dùng của trình duyệt, nên cần Chrome",
        ],
      },
      {
        title: "Tả một lần, rồi tuần nào nó cũng tự chạy",
        body: "Nói cho trợ lý việc bạn muốn làm, bằng đúng những lời bạn nói với một đồng nghiệp — đọc số liệu tuần rồi, lấy các khiếu nại dính tới đó, viết bản tóm tắt, gửi cho quản lý. Nó dựng ra đúng công việc ấy, chạy thử ngay trước mặt bạn với dữ liệu thật, rồi từ đó tự chạy. Thứ gì không rút lại được thì không xảy ra sau lưng bạn.",
        points: [
          "Cài đặt bằng cách tả ra, không phải bằng cách ngồi vẽ",
          "Chạy theo lịch, hoặc chạy ngay khi bạn bảo",
          "Nhiều bước chạy cùng lúc, việc dài vẫn xong nhanh",
          "Máy có khởi động lại thì nó chạy tiếp từ chỗ đang dở",
          "Chưa xác nhận thì chưa gửi — và chỉ gửi tới địa chỉ bạn đã duyệt",
        ],
      },
      {
        title: "Nó làm việc ngay trong những công cụ bạn đang dùng",
        body: "Gmail, Calendar, Drive, Slack, WhatsApp và Zalo OA — cộng thêm GitHub, Jira và Trello — phần lớn chỉ cần một cú bấm là nối xong. Và bất cứ hệ thống nào khác công ty bạn đang chạy cũng cắm vào được, để trợ lý với tới luôn.",
        points: ["Nó không bao giờ âm thầm gửi hay sửa thứ gì", "Thông tin đăng nhập của mỗi người mã hoá riêng"],
      },
      {
        title: "Tìm lại câu trả lời hồi tháng trước",
        body: "Một lần tìm quét hết mọi thứ đã chạy, đã hỏi và đã tự động hoá. Thứ cả đội chạy thì chia sẻ cho cả đội; hội thoại và công việc của riêng bạn chỉ trả về cho bạn, dưới dạng đường dẫn chứ không phải trích đoạn — nên tìm kiếm không bao giờ làm lộ thứ đồng nghiệp viết.",
        points: ["Tìm được cả khi gõ thiếu hoặc sai chính tả — tiếng Việt, tiếng Anh, 中文"],
      },
      {
        title: "Người nghỉ việc thì quyền truy cập nghỉ theo",
        body: "Bốn vai trò, áp ở mọi màn hình. Ai cũng tự quản key của mình; chủ sở hữu có thể cấp hoặc thu hồi thay người khác, và mỗi lần như vậy đều được ghi lại.",
        points: ["Thông tin đăng nhập của mỗi người mã hoá riêng", "Giới hạn tần suất và khoá tài khoản"],
      },
    ],
  },

  evidence: {
    eyebrow: "Đo được, không phải tự nhận",
    heading: "Thử trên dữ liệu thật trước khi tới tay bạn",
    lead: {
      ink: "Mỗi bản phát hành đều được đem chạy với cơ sở dữ liệu thật, chứ không phải ngồi suy luận.",
      rest: "Chính nhờ vậy mà ba chuyện dưới đây lộ ra — cả ba đều là thứ ngồi nghĩ kỹ tới đâu cũng không thấy. Tìm ra, truy đúng nguyên nhân, sửa, rồi đo lại.",
    },
    cards: [
      {
        measure: "phát hiện 01 · đã sửa",
        caption: "trước đây: quy tắc chỉ được viết vào phần chỉ dẫn",
        after: "giờ nó chạy thử trên dữ liệu thật của bạn trước",
        title: "Bảo trợ lý phải làm gì là chưa đủ. Cho nó thấy mới đủ.",
        body: "Khi trợ lý dựng giúp bạn một việc như vậy, trước đây chúng tôi chỉ viết quy tắc vào phần chỉ dẫn của nó. Tốt nhất cũng chỉ trúng ba trên mười lăm lần. Giờ nó đem bản nháp chạy thử với dữ liệu thật của bạn trước, đọc lại xem thực tế đã xảy ra những gì — rồi tự sửa dựa trên thứ nó nhìn thấy. Đã kiểm trọn đường, trên dữ liệu thật chứ không phải một lần chạy diễn tập.",
      },
      {
        measure: "phát hiện 02 · đã sửa",
        caption: "trước đây: một việc đã lưu bị hỏng vì một tham chiếu sống",
        after: "giờ nó chỉ giấu thứ sẽ hết hạn",
        title: "Lỗi cả ngành cứ lặp lại — và chúng tôi mắc tới hai lần",
        body: "Trong lúc thử các công cụ, trợ lý nhìn thấy một mã tham chiếu thật rồi ghi thẳng nó vào việc đã lưu như một giá trị cố định. Chạy được đúng một lần rồi hỏng ngay lần sau — mã đó chỉ có hiệu lực cho đúng lần thử ấy. Giấu sạch mọi giá trị thì sửa được lỗi này nhưng hỏng chỗ khác: việc đó không còn phân biệt nổi bốn lượt tra na ná nhau. Nên giờ nó giấu đúng thứ sẽ hết hạn, và vẫn cho thấy thứ giúp phân biệt lượt tra này với lượt tra kia.",
      },
      {
        measure: "phát hiện 03 · đã sửa",
        caption: "trước đây: lượt nói mà không tra cứu gì",
        after: "giờ 0 trên 12",
        title: "Chỉ một dòng chữ khiến nó trả lời theo trí nhớ",
        body: "Hỏi bằng giọng nói, nó trả lời mà không tra gì 3 trên 17 lượt — trong khi cùng những câu đó gõ bằng chữ thì 0 trên 6. Nguyên nhân là một dòng bảo nó hãy ngắn gọn: nó hiểu thành kiểm tra ít lại, chứ không phải nói ngắn lại. Tách bạch cách nói ra khỏi mức độ phải tra cứu là về không trên mười hai.",
      },
    ],
    measurement: {
      eyebrow: "Đo bằng cách nào",
      note: "Chạy lại ở mỗi bản phát hành",
      suites: [
        {
          name: "Bộ kiểm hành vi",
          scale: "17 kịch bản × 5 lượt",
          body: "Mỗi kịch bản chạy lại năm lần và chấm theo từng tiêu chí riêng thay vì đạt/không đạt, nên câu trả lời đúng vì lý do sai vẫn lộ ra.",
          tags: [
            "chọn đúng công cụ",
            "hỏi đúng thông tin",
            "bám đúng số liệu thật",
            "biết khi nào không nên làm",
            "biết khi nào dừng",
            "báo trước thứ sắp gửi",
            "trả bảng, không trả tường chữ",
          ],
        },
        {
          name: "Chọn giữa rất nhiều công cụ",
          scale: "60 mỗi lần, trong 102",
          body: "Mỗi câu hỏi được trả lời với toàn bộ số công cụ đang có, vì chọn đúng trong sáu cái chẳng chứng minh được gì về việc chọn đúng trong sáu mươi.",
          tags: ["12 có sẵn", "42 từ ứng dụng đã nối", "48 từ hệ thống gắn thêm"],
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
      ink: "LAAM được làm cho chính đội của chúng tôi và chạy trên chính máy của chúng tôi.",
      rest: "Nó không phải sản phẩm dạng dịch vụ và chúng tôi không giả vờ ngược lại — thứ chúng tôi cho bạn xem được là một hệ thống đang chạy, những quyết định đằng sau nó, và cần những gì để dựng một cái như vậy cho đội bạn.",
    },
    facts: [
      { label: "Phiên bản", value: "v2.5.0" },
      { label: "Chi phí model cục bộ", value: "$0" },
      { label: "Connector", value: "9 + MCP" },
      { label: "Dữ liệu nằm ở", value: "Máy của bạn" },
    ],
    nextLabel: "Sắp tới",
    ahead: [
      "Nhật ký đầy đủ hơn — hiện đã ghi thao tác ghi, cấp quyền và đổi vai trò",
      "Đọc ảnh và bản scan trên cả model đặt trên cloud, không chỉ model cục bộ",
      "Nhận giọng nói tự dựng, để voice thôi phụ thuộc Chrome",
    ],
  },

  contact: {
    eyebrow: "Nói chuyện với chính đội đã làm ra nó",
    heading: "Chúng tôi mở console thật cho bạn xem",
    lead: {
      ink: "Bốn mươi phút, câu hỏi thật, workflow thật",
      rest: "— gồm cả những phần còn nằm trong kế hoạch. Cứ mang theo những câu bạn sẽ hỏi trước khi tự vận hành một thứ như thế này.",
    },
    primary: "Đặt lịch xem demo",
    secondary: "Về đầu trang",
    mailSubject: "Đặt lịch xem demo LAAM",
  },

  footer: { wordmark: "LAAM — Local AI Agent Monitoring", org: "Nền tảng nội bộ" },

  skipToContent: "Bỏ qua, tới nội dung chính",
};
