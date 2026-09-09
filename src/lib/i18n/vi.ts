import type { en } from "./en";

/**
 * The page in Vietnamese.
 *
 * Typed as `typeof en`, so a key that goes missing or gets renamed on one side is
 * a build error rather than a hole someone finds in production.
 *
 * This is the SOURCE locale for the current copy: the marketing brief in
 * `docs/laam-homepage-vi.html` is Vietnamese prose under English headlines, and
 * the body text below is that brief — kept as written wherever the layout allows
 * it, rather than re-translated back out of the English file.
 *
 * The English headlines from the brief ("Turn Business Complexity Into Faster
 * Decisions", "From Data to Action", "Your Data. Your Infrastructure. Your
 * Control.") stay English in this locale too. That is how the brief presents
 * them — an English section title over Vietnamese body copy — and it is how the
 * brand speaks.
 *
 * Technical vocabulary stays English where that is what a Vietnamese reader
 * actually says: workflow, model, connector, MCP, console, database.
 */
export const vi: typeof en = {
  meta: {
    title: "LAAM — AI Agent cho doanh nghiệp",
    description:
      "LAAM là AI Agent cho doanh nghiệp, kết nối AI với dữ liệu, công cụ và workflow mà doanh nghiệp đang sử dụng. Hỏi bằng ngôn ngữ tự nhiên, nhận câu trả lời từ nguồn dữ liệu thật, và hành động ngay trong cùng một cuộc trò chuyện.",
  },

  langToggle: { label: "English", aria: "View this page in English" },

  nav: {
    links: [
      { href: "#top", label: "Về LAAM" },
      { href: "#solutions", label: "Giải pháp" },
      { href: "#how-it-works", label: "Cách LAAM hoạt động" },
      { href: "#security", label: "Bảo mật & kiểm soát" },
      { href: "#custom", label: "Tùy chỉnh cho doanh nghiệp" },
    ],
    cta: "Đặt lịch xem demo",
  },

  boot: {
    calibrating: "đang khởi động console",
    mounting: "đang mở trợ lý",
    sources: (n: number) => `đang kết nối nguồn · đã nối ${n}`,
    channels: (n: number) => `sẵn sàng ${n}/${n} màn hình`,
  },

  hero: {
    eyebrows: ["AI Agent doanh nghiệp", "Dữ liệu của bạn", "Hạ tầng của bạn"],
    // Mỗi dòng là một khối trượt lên riêng, nên một dòng bị xuống hàng sẽ thành
    // hai dòng chuyển động và đẩy cả hero cao lên. Giữ mỗi dòng đủ ngắn.
    headline: ["Hỏi. Nhận", "câu trả lời.", "Và hành động."],
    lead: {
      ink: "LAAM là AI Agent cho doanh nghiệp, kết nối AI với dữ liệu, công cụ và workflow mà doanh nghiệp đang sử dụng.",
      rest: "Thay vì tìm trên nhiều hệ thống, viết SQL hay chờ Data/IT làm báo cáo, nhân viên hỏi LAAM bằng ngôn ngữ tự nhiên như trao đổi với một đồng nghiệp. LAAM truy xuất dữ liệu, tổng hợp thông tin, trả lời câu hỏi và làm tiếp các bước liên quan, tất cả trong cùng một cuộc trò chuyện.",
    },
    actions: { primary: "Đặt lịch xem demo", secondary: "Xem cách LAAM hoạt động" },
    scopeCaption: "Sơ đồ trợ lý · dữ liệu minh hoạ",
    phases: { idle: "sẵn sàng", thinking: "đang tra", speaking: "đang trả lời" },
    lookupLabel: "lượt tra",
    sourceLabel: "nguồn",
  },

  inquiries: {
    states: { answered: "đã trả lời", clarified: "hỏi lại", held: "chờ xác nhận" },
    stepsSuffix: "lượt tra",
    items: [
      { domain: "doanh thu", question: "Doanh thu tháng này so với tháng trước như thế nào?" },
      { domain: "vận hành", question: "Các công việc nào đang quá deadline?" },
      { domain: "bán lẻ", question: "Cửa hàng nào bán tốt nhất quý vừa rồi?" },
      { domain: "nhà thuốc", question: "Nhân viên nào hoàn trả nhiều nhất?" },
      { domain: "hợp đồng", question: "Đã thoả thuận thời hạn báo trước bao lâu với nhà cung cấp này?" },
      { domain: "khách hàng", question: "Tạo task follow-up cho những khách hàng chưa được liên hệ." },
    ],
  },

  solutions: {
    eyebrow: "Giải pháp LAAM",
    heading: "Biến sự phức tạp thành quyết định nhanh hơn",
    lead: "Doanh nghiệp có ngày càng nhiều dữ liệu và công cụ, nhưng việc tìm đúng thông tin và biến thông tin đó thành hành động vẫn có thể mất nhiều thời gian.",
    whoLabel: "LAAM",
    items: [
      {
        title: "Dữ liệu nằm ở nhiều nơi",
        body: "CRM, database, báo cáo và các ứng dụng khác nhau lưu giữ những phần thông tin khác nhau. Nhân viên phải biết dữ liệu nằm ở đâu và tìm kiếm trên nhiều hệ thống.",
        answeredBy:
          "Người dùng chỉ cần đặt câu hỏi. LAAM kết nối với các nguồn dữ liệu phù hợp để tìm và tổng hợp thông tin cần thiết.",
      },
      {
        title: "Những câu hỏi đơn giản vẫn phải chờ báo cáo",
        body: "Manager và các team nghiệp vụ thường xuyên cần số liệu để theo dõi hoạt động hoặc đưa ra quyết định nhưng phải gửi yêu cầu đến Data/IT team.",
        answeredBy:
          "Nhân viên có thể trực tiếp hỏi dữ liệu doanh nghiệp bằng ngôn ngữ tự nhiên mà không cần viết SQL hoặc tạo một yêu cầu báo cáo mới.",
      },
      {
        title: "Công việc vẫn phụ thuộc vào nhiều thao tác thủ công",
        body: "Sau khi có thông tin, người dùng vẫn phải chuyển sang những công cụ khác để gửi email, tạo task, cập nhật dữ liệu hoặc thực hiện bước tiếp theo.",
        answeredBy:
          "Người dùng không cần chuyển sang công cụ khác để làm bước tiếp theo. LAAM chuẩn bị sẵn thao tác ngay trong cuộc hội thoại và chỉ thực hiện sau khi người dùng xác nhận.",
      },
      {
        title: "Báo cáo tốn thời gian để tổng hợp",
        body: "Nhiều báo cáo vận hành và doanh thu phải được thu thập, tổng hợp và cập nhật lặp lại.",
        answeredBy:
          "Doanh nghiệp mô tả một lần những báo cáo lặp lại, sau đó LAAM tự chạy theo lịch: gom số liệu từ nhiều nguồn, tổng hợp và gửi đến đúng người.",
      },
    ],
    answer: {
      ink: "Một lớp AI. Xuyên suốt doanh nghiệp.",
      rest: "LAAM rút ngắn khoảng cách giữa những bước sau, để dữ liệu doanh nghiệp trở nên dễ tiếp cận và hữu ích hơn trong công việc hàng ngày.",
      chain: ["Câu hỏi", "Dữ liệu", "Phân tích", "Quyết định", "Hành động"],
    },
  },

  howItWorks: {
    eyebrow: "Cách LAAM hoạt động",
    heading: "Từ dữ liệu đến hành động",
    lead: "LAAM hoạt động như một lớp AI kết nối con người với dữ liệu, công cụ và workflow của doanh nghiệp. Thay vì yêu cầu nhân viên phải học cách sử dụng từng hệ thống, LAAM cho phép họ bắt đầu từ điều đơn giản nhất: hỏi điều mình cần.",
    flow: ["Dữ liệu & ứng dụng", "Công cụ / MCP", "LAAM", "Câu trả lời & hành động"],
    steps: [
      {
        title: "Hỏi",
        body: "Người dùng đặt câu hỏi bằng AI Chat hoặc Voice Chat theo cách giao tiếp tự nhiên.",
        examples: [
          "“Doanh thu tháng này so với tháng trước như thế nào?”",
          "“Những khách hàng nào chưa được follow-up?”",
          "“Các công việc nào đang quá deadline?”",
        ],
      },
      {
        title: "Hiểu",
        body: "LAAM xác định yêu cầu và sử dụng đúng công cụ được cấu hình để làm việc với dữ liệu hoặc hệ thống liên quan. Không cần người dùng biết dữ liệu nằm ở database nào hay phải chạy câu query nào.",
      },
      {
        title: "Trả lời",
        body: "LAAM truy xuất và tổng hợp dữ liệu để cung cấp thông tin phù hợp với câu hỏi của người dùng. Từ một câu hỏi, LAAM có thể hỗ trợ:",
        capabilities: [
          "Truy xuất và tổng hợp dữ liệu",
          "Theo dõi thông tin vận hành",
          "Theo dõi doanh thu",
          "Hỗ trợ phân tích thông tin",
          "Tra cứu thêm thông tin từ web khi cần",
          "Đọc và phân tích hình ảnh đính kèm",
        ],
        note: "Với những kết quả nhiều dòng, LAAM hiển thị bảng dữ liệu gốc lấy thẳng từ hệ thống ngay dưới câu trả lời mà không phải AI chép lại, nên con số người dùng đọc đúng là con số trong hệ thống.",
      },
      {
        title: "Hành động",
        body: "Công việc không dừng lại ở một câu trả lời. Trong cùng cuộc hội thoại, LAAM có thể dùng công cụ đã kết nối để thực hiện bước tiếp theo; mọi hành động ghi dữ liệu đều hiện thẻ xác nhận, chờ người dùng duyệt trước khi chạy.",
        dialogue: [
          {
            ask: "“Cho tôi danh sách khách hàng chưa được follow-up.”",
            result: "LAAM truy xuất dữ liệu.",
          },
          {
            ask: "“Tạo task follow-up cho team.”",
            result: "LAAM chuẩn bị sẵn task, hiện thẻ xác nhận — duyệt là gửi.",
          },
        ],
      },
    ],
    surfaces: {
      eyebrow: "Các màn hình",
      heading: "Nơi công việc diễn ra",
      lead: "Mỗi màn hình dưới đây là thứ người dùng làm việc hàng ngày. Dữ liệu hiển thị ở đây là dữ liệu mẫu; dữ liệu thật của doanh nghiệp chỉ xuất hiện sau khi đăng nhập.",
    },
    items: [
      {
        title: "Những câu hỏi hàng ngày, trả lời ngay tại chỗ",
        body: "Hỏi về số liệu, đưa cho LAAM một file PDF hay ảnh chụp phiếu giao hàng, hoặc nhờ tra cứu thêm trên web. Câu trả lời luôn lấy từ nguồn thật, không phải từ trí nhớ của AI — và kết quả nhiều dòng luôn kèm bảng dữ liệu gốc của hệ thống.",
        points: [
          "Đọc ảnh, bản scan, PDF và file Word (vi/en/zh)",
          "Tra cứu thêm thông tin từ web khi cần",
          "Hiển thị bảng dữ liệu gốc dưới câu trả lời, không phải bản chép lại",
          "Lưu câu trả lời thành PDF để gửi đi",
        ],
      },
      {
        title: "Hỏi bằng giọng nói khi tay đang bận",
        body: "Một console toàn màn hình mà bạn chỉ cần nói chuyện. LAAM đọc câu trả lời ngay khi có, và đưa bảng biểu lên panel bên cạnh thay vì đọc từng con số — dù bạn đang đứng quầy hay đi trong kho, câu trả lời vẫn rõ ràng.",
        points: [
          "Luôn lắng nghe, nên bạn cứ hỏi tiếp",
          "Xem lại toàn bộ hội thoại bất cứ lúc nào",
          "Bảng biểu hiển thị trên màn hình, phần tóm tắt đọc bằng giọng nói",
        ],
      },
      {
        title: "Mô tả một lần. Chạy lặp lại theo lịch.",
        body: "Với những việc lặp đi lặp lại — ví dụ tổng hợp báo cáo từ nhiều nguồn rồi gửi email mỗi tuần — doanh nghiệp có thể xây một Automation. Không cần vẽ sơ đồ thủ công: mô tả công việc bằng lời, LAAM dựng sẵn các bước và chạy thử trên dữ liệu thật để người dùng duyệt trước khi đưa vào lịch trình. Tự động hoá công việc mà vẫn trong tầm kiểm soát của bạn.",
        points: [
          "Thiết lập bằng cách mô tả, không phải bằng cách vẽ",
          "Chạy theo lịch, hoặc chạy ngay khi bạn yêu cầu",
          "Xử lý nhiều bước song song, việc dài vẫn xong nhanh",
          "Bị gián đoạn thì phục hồi đúng bước đang chạy, không phải làm lại từ đầu",
          "Không gửi gì trước khi bạn xác nhận",
        ],
      },
      {
        title: "Kết nối sẵn với công cụ đội ngũ đang dùng",
        body: "Có sẵn trong LAAM: Gmail, Calendar, Google Drive, Slack, WhatsApp, Zalo OA, Jira, Trello và GitHub — kết nối bằng tài khoản của doanh nghiệp. Với hệ thống riêng của doanh nghiệp, trong quá trình triển khai, đội ngũ LAAM xây một lớp kết nối trung gian (MCP) cho đúng hệ thống đó, để AI làm việc được với dữ liệu và nghiệp vụ đặc thù của doanh nghiệp.",
        points: [
          "Database",
          "CRM",
          "Phần mềm bán hàng",
          "Ứng dụng nội bộ",
          "Phần mềm chuyên ngành",
        ],
      },
    ],
  },

  security: {
    eyebrow: "Bảo mật & kiểm soát",
    heading: "Dữ liệu của bạn. Hạ tầng của bạn. Quyền kiểm soát của bạn.",
    lead: "Đưa AI vào doanh nghiệp không chỉ là bài toán về khả năng của AI. Đó còn là câu hỏi:",
    questions: "AI chạy ở đâu? Dữ liệu được xử lý như thế nào? Và doanh nghiệp kiểm soát AI ra sao?",
    leadAfter:
      "LAAM được thiết kế hướng đến môi trường doanh nghiệp cần chủ động hơn trong việc triển khai AI và quản lý dữ liệu nội bộ.",
    pillars: [
      {
        title: "Triển khai trên hạ tầng riêng",
        body: [
          "LAAM có thể được triển khai trên hạ tầng riêng của doanh nghiệp, giúp tổ chức chủ động hơn trong cách hệ thống AI được vận hành.",
        ],
      },
      {
        title: "Lựa chọn mô hình linh hoạt",
        body: [
          "LAAM hỗ trợ nhiều lựa chọn mô hình AI, từ các model cloud đến model chạy cục bộ, tùy theo nhu cầu triển khai, ngân sách và yêu cầu bảo mật dữ liệu của doanh nghiệp.",
          "Với các tác vụ nội bộ phù hợp, doanh nghiệp có thể cấu hình để chạy bằng model cục bộ, giảm bớt phụ thuộc vào chi phí tính theo API cho những phần việc đó.",
        ],
      },
      {
        title: "Kiểm soát quyền truy cập dữ liệu",
        body: [
          "LAAM kết nối AI với các hệ thống doanh nghiệp thông qua bộ công cụ được cấu hình theo nhu cầu sử dụng. Doanh nghiệp quyết định AI được xem gì và làm được gì. Ngoài phạm vi đó, AI không tự vào hệ thống được. Mọi hành động ghi dữ liệu của AI đều dừng lại ở thẻ xác nhận, không tự động chạy.",
          "Quyền truy cập được quản lý theo vai trò: mỗi người chỉ thấy phần việc của mình, và khi một nhân viên nghỉ, toàn bộ quyền cùng khoá truy cập của họ bị thu hồi ngay, có ghi nhật ký.",
        ],
      },
    ],
    summary: {
      eyebrow: "Kết quả",
      ink: "AI doanh nghiệp với quyền kiểm soát cao hơn",
      benefits: [
        "Giữ quyền kiểm soát tốt hơn đối với dữ liệu",
        "Chủ động lựa chọn môi trường triển khai AI",
        "Kiểm soát cách AI tương tác với hệ thống nội bộ",
        "Giảm lo ngại khi đưa AI vào những workflow thực tế",
      ],
      tagline: "Ứng dụng AI mà không đánh mất quyền kiểm soát.",
    },
  },

  custom: {
    eyebrow: "Tùy chỉnh cho doanh nghiệp",
    heading: "AI xây quanh cách doanh nghiệp bạn vận hành",
    lead: "Không có hai doanh nghiệp nào có cùng dữ liệu, cùng hệ thống và cùng cách vận hành. Vì vậy, LAAM không được triển khai như một AI assistant chung cho tất cả doanh nghiệp.",
    blocks: [
      {
        title: "Xây cho hệ thống của bạn",
        body: "Đội ngũ LAAM tìm hiểu những hệ thống mà doanh nghiệp đang sử dụng, từ đó xác định cách LAAM cần kết nối và làm việc với chúng.",
        items: [
          "CRM",
          "Database",
          "Báo cáo",
          "Công cụ giao tiếp",
          "Công cụ quản lý dự án",
          "Ứng dụng nội bộ",
        ],
      },
      {
        title: "Xây cho workflow của bạn",
        body: "LAAM được cấu hình dựa trên những workflow thực tế mà doanh nghiệp muốn cải thiện. Có thể bắt đầu từ những nhu cầu như:",
        items: [
          "Truy xuất dữ liệu nhanh hơn",
          "Giảm yêu cầu báo cáo thủ công",
          "Theo dõi hoạt động và doanh thu",
          "Tự động hóa các bước công việc lặp lại",
          "Kết nối thông tin giữa nhiều hệ thống",
          "Xây dựng AI Assistant cho từng nhu cầu nghiệp vụ",
        ],
      },
      {
        title: "Xây bộ công cụ riêng cho bạn",
        body: "Dựa trên nhu cầu triển khai, đội ngũ LAAM xây lớp kết nối trung gian (MCP) và bộ công cụ riêng cho từng hệ thống chuyên ngành, để AI làm việc được với dữ liệu, ứng dụng và quy trình đặc thù của doanh nghiệp.",
        note: "Mục tiêu không phải đưa thêm một AI tool vào hệ thống. Mục tiêu là đưa AI vào chính cách doanh nghiệp đang vận hành.",
      },
    ],
    quote: ["Doanh nghiệp không phải đổi mình cho vừa AI.", "AI phải vừa với doanh nghiệp."],
  },

  contact: {
    eyebrow: "Trao đổi với đội ngũ xây dựng LAAM",
    heading: "Xem LAAM làm được gì cho doanh nghiệp bạn",
    lead: {
      ink: "Khám phá cách LAAM kết nối trực tiếp với dữ liệu, công cụ và workflow",
      rest: "doanh nghiệp bạn đang vận hành — và việc triển khai cho đội ngũ của bạn sẽ như thế nào.",
    },
    tagline: "Hỏi. Nhận câu trả lời. Và hành động.",
    primary: "Đặt lịch xem demo",
    secondary: "Về đầu trang",
    mailSubject: "Đặt lịch demo LAAM",
  },

  footer: { wordmark: "LAAM", org: "AI Agent doanh nghiệp" },

  skipToContent: "Tới nội dung chính",
};
