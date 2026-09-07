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
 * Note the ceiling on this, though — the page addresses business owners,
 * not the engineers it was first written for, so anything that CAN be said in
 * Vietnamese is: "lượt tra" not "lookup", "cổng xác nhận" not "write gate".
 * English is a last resort here, where it used to be a convenience.
 *
 * The crafted headlines are rewritten, not translated. Each was written again
 * in Vietnamese to make the same point with the same economy, which sometimes
 * means a different image — the English hero turns on "answers back", which has
 * no Vietnamese equivalent that fits three short lines, so the Vietnamese turns
 * on "giờ biết trả lời" instead: the data has learned to answer.
 *
 * This pass rewrote the rest of the page the same way the headline already was:
 * short sentences, the benefit first, one idea per sentence, so a reader with no
 * technical background and a reader who could build this themselves both get the
 * point on the first read.
 */
export const vi: typeof en = {
  meta: {
    title: "LAAM — Hệ thống công ty bạn, giờ biết trả lời",
    description:
      "Hỏi dữ liệu công ty bạn như hỏi một đồng nghiệp — không cần SQL, không cần đặt yêu cầu báo cáo, không phải chờ. LAAM tự tra số liệu thật, trả lời bạn, rồi làm luôn phần việc tiếp theo. Chạy ngay trên máy của bạn — hỏi bằng model cục bộ thì không tốn đồng nào.",
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
      rest: "Nó kết nối tới database, tài liệu và các hệ thống công ty bạn đang dùng — phần mềm bán hàng, hệ đặt lịch, ứng dụng nội bộ — tự tra số liệu thật rồi làm luôn phần việc tiếp theo. Câu nào hiểu được hai cách, nó sẽ hỏi lại bạn thay vì đoán bừa. Và vì chạy ngay trên máy của bạn, dữ liệu không bao giờ rời khỏi công ty.",
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
        body: "\"Tháng này ai hoàn tiền nhiều nhất?\" là câu hỏi mười giây. Nhưng nó vẫn phải xếp hàng sau người biết viết query, rồi một ngày sau mới quay về dưới dạng file Excel đã lỗi thời.",
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
        body: "Con số đó lấy từ đâu? Nó đã gọi công cụ nào? Nó suýt gửi cái gì, cho ai? Không trả lời rõ được những câu đó thì không ai nên để nó đụng vào dữ liệu thật.",
        answeredBy: "Cổng xác nhận, và toàn bộ nhật ký",
      },
    ],
    answer: {
      eyebrow: "Lời giải",
      ink: "Ba vấn đề, ba lời giải, một màn hình.",
      rest: "Hàng đợi biến mất vì câu hỏi đi thẳng vào dữ liệu — và nếu câu hỏi thật sự mơ hồ, nó hỏi lại bạn thay vì đoán bừa. Việc lặp mỗi tuần chỉ cần mô tả một lần là tự chạy. Còn thứ gì không thể hoàn tác thì luôn chờ bạn xác nhận, và được ghi lại để bạn xem lại bất cứ lúc nào.",
    },
  },

  channels: {
    eyebrow: "Nền tảng",
    heading: "Bảy mặt làm việc, một console",
    lead: "Mỗi màn hình dưới đây là thứ người ta dùng mỗi ngày — đã chạy thật, không phải kế hoạch. Dữ liệu bạn thấy ở đây chỉ là dữ liệu minh hoạ; dữ liệu thật chỉ hiện ra khi bạn đăng nhập.",
    items: [
      {
        title: "Nó đã làm gì, sau đó không còn là bí ẩn",
        body: "Mọi thao tác của trợ lý, từ mọi máy, truyền về ngay khi đang diễn ra: nó gọi công cụ nào, theo thứ tự nào, mỗi bước mất bao lâu, tốn bao nhiêu — và báo ngay nếu có việc bị đứng lại.",
        points: [
          "Xem từng bước gọi công cụ trong một lượt chạy",
          "Mọi câu trả lời truy được về đúng số liệu đã dùng",
          "Thao tác thay đổi dữ liệu luôn chờ xác nhận, kèm tên người nhận",
          "Báo ngay khi một lượt chạy bị đứng",
          "Chi phí theo từng model, theo từng ngày",
        ],
      },
      {
        title: "Những câu hỏi hằng ngày, trả lời ngay tại chỗ",
        body: "Hỏi về số liệu của bạn, đưa nó một file PDF hay ảnh chụp phiếu giao hàng, nhờ nó tra một thứ trên mạng — nó luôn trả lời từ nguồn thật, không bao giờ đoán theo trí nhớ. Chạy bằng model đặt ngay trên máy bạn thì mỗi câu trả lời như vậy miễn phí; sau này thêm model trên cloud thì vẫn là trợ lý đó, vẫn với tới từng ấy thứ.",
        points: [
          "Đọc ảnh, bản scan, file PDF và Word (vi/en/zh)",
          "Tìm trên web bằng máy chủ tìm kiếm của chính bạn",
          "Tra địa chỉ, thời tiết và địa điểm quanh đây",
          "Lưu câu trả lời thành PDF để gửi đi",
        ],
      },
      {
        title: "Bận tay thì cứ hỏi bằng miệng",
        body: "Một màn hình toàn cảnh, bạn nói chuyện thẳng với nó. Nó đọc câu trả lời ngay khi đang trả lời, còn bảng biểu và biểu đồ hiện lên ở một panel bên cạnh thay vì đọc từng con số — nên dù bạn đang đứng ở quầy hay đi trong kho, vẫn nhận được câu trả lời rõ ràng.",
        points: [
          "Nó nghe liên tục, cứ hỏi tiếp là được",
          "Xem lại đoạn hội thoại bất cứ lúc nào, ngay tại chỗ",
          "Nhận giọng nói hiện dùng của trình duyệt, nên cần Chrome",
        ],
      },
      {
        title: "Tả một lần, rồi tuần nào nó cũng tự chạy",
        body: "Nói cho trợ lý việc bạn muốn làm, bằng đúng lời bạn nói với một đồng nghiệp — đọc số liệu tuần rồi, lấy các khiếu nại liên quan, viết bản tóm tắt, gửi cho quản lý. Nó dựng ra đúng công việc ấy, thử ngay trên dữ liệu thật trước mặt bạn, rồi từ đó tự chạy một mình. Việc gì không thể hoàn tác thì không xảy ra nếu chưa có bạn.",
        points: [
          "Cài đặt bằng cách mô tả, không cần ngồi vẽ",
          "Chạy theo lịch, hoặc chạy ngay khi bạn bảo",
          "Nhiều bước chạy cùng lúc, việc dài vẫn xong nhanh",
          "Máy khởi động lại thì nó chạy tiếp từ chỗ đang dở",
          "Chưa xác nhận thì chưa gửi — và chỉ gửi tới địa chỉ bạn đã duyệt",
        ],
      },
      {
        title: "Nó làm việc ngay trong những công cụ bạn đang dùng",
        body: "Gmail, Calendar, Drive, Slack, WhatsApp và Zalo OA — cộng thêm GitHub, Jira và Trello — hầu hết chỉ cần một cú bấm là nối xong. Hệ thống nào khác công ty bạn đang chạy cũng cắm vào được, để trợ lý với tới luôn.",
        points: ["Nó không bao giờ âm thầm gửi hay sửa thứ gì", "Thông tin đăng nhập của mỗi người mã hoá riêng"],
      },
      {
        title: "Tìm lại câu trả lời hồi tháng trước",
        body: "Một lần tìm quét hết mọi thứ đã chạy, đã hỏi, đã tự động hoá. Việc cả đội chạy thì cả đội thấy được; hội thoại và công việc riêng của bạn chỉ trả về cho bạn, dưới dạng đường dẫn chứ không phải trích đoạn — nên tìm kiếm không bao giờ làm lộ điều đồng nghiệp đã viết.",
        points: ["Tìm được cả khi gõ thiếu hoặc sai chính tả — tiếng Việt, tiếng Anh, 中文"],
      },
      {
        title: "Người nghỉ việc thì quyền truy cập nghỉ theo",
        body: "Bốn vai trò, áp dụng ở mọi màn hình. Ai cũng tự quản key của mình; chủ sở hữu có thể cấp hoặc thu hồi quyền thay người khác, và mỗi lần như vậy đều được ghi lại.",
        points: ["Thông tin đăng nhập của mỗi người mã hoá riêng", "Giới hạn tần suất và khoá tài khoản"],
      },
    ],
  },

  evidence: {
    eyebrow: "Đo được, không phải tự nhận",
    heading: "Thử trên dữ liệu thật trước khi tới tay bạn",
    lead: {
      ink: "Mỗi bản phát hành đều được chạy thử với một database thật — không chỉ ngồi suy luận.",
      rest: "Nhờ vậy ba lỗi dưới đây mới lộ ra — cả ba đều là thứ nghĩ kỹ đến đâu cũng không thấy trước. Chúng tôi tìm ra, truy đúng nguyên nhân, sửa, rồi đo lại.",
    },
    cards: [
      {
        measure: "phát hiện 01 · đã sửa",
        caption: "trước đây: chỉ viết quy tắc vào phần chỉ dẫn",
        after: "giờ nó chạy thử trên dữ liệu thật của bạn trước",
        title: "Bảo trợ lý phải làm gì là chưa đủ. Cho nó thấy mới đủ.",
        body: "Khi trợ lý dựng một việc tự động như vậy, trước đây chúng tôi chỉ viết quy tắc vào phần chỉ dẫn — và nó làm đúng nhiều nhất 3 trên 15 lần. Giờ nó chạy thử bản nháp trên dữ liệu thật của bạn trước, xem lại thực tế đã xảy ra gì, rồi tự sửa dựa trên điều nó thấy. Đã kiểm chứng trọn đường, trên dữ liệu thật chứ không phải một lần chạy thử.",
      },
      {
        measure: "phát hiện 02 · đã sửa",
        caption: "trước đây: một việc đã lưu bị hỏng vì một con số cố định sai chỗ",
        after: "giờ nó chỉ giấu giá trị sẽ hết hạn",
        title: "Lỗi cả ngành cứ lặp lại — và chúng tôi mắc tới hai lần",
        body: "Trong lúc thử công cụ, trợ lý thấy một mã tham chiếu thật rồi lưu thẳng nó vào việc tự động như một giá trị cố định. Chạy đúng một lần rồi hỏng ngay lần sau — mã đó chỉ có hiệu lực cho đúng lần thử ấy. Cách sửa đầu tiên, giấu sạch mọi giá trị, lại gây lỗi khác: việc đó không còn phân biệt được bốn lượt tra gần giống nhau. Nên giờ nó chỉ giấu đúng giá trị sẽ hết hạn, và vẫn giữ lại thứ giúp phân biệt lượt tra này với lượt tra kia.",
      },
      {
        measure: "phát hiện 03 · đã sửa",
        caption: "trước đây: lượt nói mà không tra cứu gì",
        after: "giờ 0 trên 12",
        title: "Chỉ một dòng chữ khiến nó trả lời theo trí nhớ",
        body: "Hỏi bằng giọng nói, nó bỏ qua việc tra cứu 3 trên 17 lượt — trong khi đúng những câu đó gõ bằng chữ thì chỉ sai 0 trên 6. Nguyên nhân là một dòng chỉ dẫn bảo nó \"trả lời ngắn gọn\": nó hiểu thành kiểm tra ít lại, chứ không phải nói ngắn lại. Tách bạch cách nói ra khỏi mức độ phải tra cứu, tỷ lệ đó về 0 trên 12.",
      },
    ],
    measurement: {
      eyebrow: "Đo bằng cách nào",
      note: "Chạy lại ở mỗi bản phát hành",
      suites: [
        {
          name: "Bộ kiểm hành vi",
          scale: "17 kịch bản × 5 lượt",
          body: "Mỗi kịch bản chạy lại năm lần, chấm riêng theo từng tiêu chí thay vì chỉ đạt/không đạt — nên câu trả lời đúng nhưng vì lý do sai vẫn bị phát hiện.",
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
          body: "Mỗi câu hỏi được trả lời với toàn bộ công cụ đang có, vì chọn đúng trong sáu cái chẳng chứng minh được gì về việc chọn đúng trong sáu mươi.",
          tags: ["12 có sẵn", "42 từ ứng dụng đã nối", "48 từ hệ thống gắn thêm"],
        },
      ],
      footer: {
        ink: "Bản thân điểm số cũng là một phần của buổi demo.",
        rest: "Đó là những lần chạy có ngày tháng, trên một model có tên, kể cả những dòng điểm thấp — đáng để trao đổi trực tiếp, và sẽ rất tệ nếu chỉ để lại trên trang web dưới dạng con số không kèm lý do.",
      },
    },
  },

  status: {
    eyebrow: "Đang ở đâu",
    heading: "Công cụ nội bộ, dùng hằng ngày",
    lead: {
      ink: "LAAM được làm cho chính đội của chúng tôi và chạy trên chính máy của chúng tôi.",
      rest: "Đây không phải sản phẩm dạng dịch vụ, và chúng tôi không giả vờ ngược lại — thứ chúng tôi cho bạn xem là một hệ thống đang chạy thật, những quyết định đằng sau nó, và những gì cần để dựng một cái như vậy cho đội bạn.",
    },
    facts: [
      { label: "Phiên bản", value: "v2.5.0" },
      { label: "Chi phí model cục bộ", value: "$0" },
      { label: "Connector", value: "9 + MCP" },
      { label: "Dữ liệu nằm ở", value: "Máy của bạn" },
    ],
    nextLabel: "Sắp tới",
    ahead: [
      "Nhật ký hoạt động đầy đủ hơn — hiện đã ghi thao tác thay đổi dữ liệu, cấp quyền và đổi vai trò",
      "Đọc ảnh và bản scan trên cả model cloud, không chỉ model cục bộ",
      "Nhận giọng nói tự dựng, để voice không còn phụ thuộc Chrome",
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
