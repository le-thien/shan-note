// ============================================================================
// MODULE VIDEO HƯỚNG DẪN DỰNG HÌNH HÌNH HỌC (CÓ MINH HỌA GIỌNG NÓI TỰ NHIÊN)
// Thiết kế riêng cho ứng dụng Nét - Hoạt ảnh 60FPS trực quan (Ê-ke, Compa, Thước thẳng)
// kết hợp giọng đọc cô giáo tiếng Việt tự nhiên (tách phiên âm chuẩn & đồng bộ nhịp thở).
// ============================================================================

(function () {
  'use strict';

  // Danh sách các bài học video hướng dẫn dựng hình
  // Mỗi bước có:
  // - voice: Phụ đề hiển thị chuẩn ký hiệu toán học trên màn hình
  // - ttsText: Kịch bản phiên âm tiếng Việt tự nhiên để giọng đọc phát âm chuẩn xác như giáo viên giảng bài
  const TUTORIALS = [
    {
      id: 'perp-point-line-eke',
      number: 1,
      title: 'Vẽ vuông góc từ 1 điểm đến 1 đường bằng ê-ke',
      shortTitle: '1. Vẽ vuông góc từ 1 điểm đến 1 đường bằng ê-ke',
      category: 'Dựng hình bằng Ê-ke',
      geoTool: 'perpendicular',
      altTutorialId: 'perp-point-line',
      altTutorialLabel: '🧭 Xem cách vẽ bằng Compa',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho đường thẳng d và điểm M nằm ngoài đường thẳng d',
          voice: 'Trên mặt giấy, ta có đường thẳng d và điểm M nằm ngoài d. Hãy dùng thước ê-ke để hạ đường vuông góc từ M xuống đường thẳng d.',
          ttsText: 'Bước 1. Trên mặt giấy, ta có đường thẳng đê, và một điểm mờ nằm bên ngoài đường thẳng đó. Bây giờ, chúng ta sẽ dùng thước ê-ke, để kẻ đường thẳng đi qua điểm mờ, và vuông góc với đường thẳng đê nhé.',
          duration: 5200
        },
        {
          title: 'Bước 2: Đặt một cạnh góc vuông của ê-ke nằm sát trùng với đường thẳng d',
          voice: 'Đặt thước ê-ke lên mặt giấy sao cho một cạnh góc vuông của ê-ke nằm sát và trùng khít với đường thẳng d.',
          ttsText: 'Bước 2. Bạn đặt thước ê-ke lên mặt giấy, sao cho một cạnh góc vuông ở đáy của ê-ke nằm sát, và trùng khít với đường thẳng đê.',
          duration: 5400
        },
        {
          title: 'Bước 3: Trượt nhẹ ê-ke dọc theo đường thẳng d đến khi chạm điểm M',
          voice: 'Giữ cạnh đáy của ê-ke trượt sát dọc theo đường thẳng d cho đến khi cạnh góc vuông thẳng đứng đi qua đúng điểm M.',
          ttsText: 'Bước 3. Giữ cho mép dưới của ê-ke luôn trượt sát trên đường thẳng đê. Bạn đẩy nhẹ thước ê-ke sang ngang, cho đến khi cạnh góc vuông thẳng đứng chạm đúng vào điểm mờ.',
          duration: 5800
        },
        {
          title: 'Bước 4: Kẻ theo cạnh góc vuông của ê-ke từ M xuống d tại H (MH ⊥ d)',
          voice: 'Giữ cố định ê-ke, dùng bút chì kẻ dọc theo cạnh góc vuông từ điểm M xuống cắt đường thẳng d tại H. Ta được đường vuông góc MH ⊥ d.',
          ttsText: 'Bước 4. Giữ cố định thước ê-ke, bạn dùng bút chì kẻ một đường thẳng dọc theo mép đứng của ê-ke, đi từ điểm mờ xuống cắt đường thẳng đê tại điểm hát. Vậy là ta đã vẽ xong đường vuông góc mờ hát bằng thước ê-ke thật dễ dàng.',
          duration: 6400
        }
      ]
    },
    {
      id: 'perp-point-line',
      number: 2,
      title: 'Vẽ vuông góc từ 1 điểm đến 1 đường bằng compa',
      shortTitle: '2. Vẽ vuông góc từ 1 điểm đến 1 đường bằng compa',
      category: 'Compa & Thước thẳng',
      geoTool: 'perpendicular',
      altTutorialId: 'perp-point-line-eke',
      altTutorialLabel: '📐 Xem cách vẽ bằng Ê-ke',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho đường thẳng d và điểm M nằm ngoài đường thẳng d',
          voice: 'Trên mặt giấy, ta có đường thẳng d và điểm M nằm ngoài d. Khi không dùng ê-ke, ta có thể dựng đường vuông góc thật chính xác bằng compa và thước thẳng.',
          ttsText: 'Bước 1. Trên mặt giấy, ta có đường thẳng đê và điểm mờ nằm ngoài đường thẳng đê. Khi không có thước ê-ke, chúng ta vẫn có thể dựng đường vuông góc thật chính xác bằng compa và thước thẳng.',
          duration: 5200
        },
        {
          title: 'Bước 2: Mở compa tâm M quay cung tròn cắt đường thẳng d tại A và B',
          voice: 'Đặt mũi nhọn compa tại điểm M, mở khẩu độ compa lớn hơn khoảng cách từ M đến d, rồi quay một cung tròn cắt d tại hai điểm A và B.',
          ttsText: 'Bước 2. Bạn đặt mũi nhọn của compa ngay tại điểm mờ, mở rộng compa lớn hơn khoảng cách từ điểm mờ đến đường thẳng đê. Sau đó, quay một cung tròn cắt đường thẳng đê tại hai điểm phân biệt là a và bê.',
          duration: 6000
        },
        {
          title: 'Bước 3: Từ tâm A và tâm B quay hai cung tròn cắt nhau tại N',
          voice: 'Giữ nguyên độ mở compa, lần lượt đặt mũi nhọn tại A và tại B, quay hai cung tròn ở phía đối diện cắt nhau tại điểm N.',
          ttsText: 'Bước 3. Giữ nguyên độ mở của compa, bạn lần lượt đặt mũi nhọn tại điểm a, rồi tại điểm bê, vẽ hai cung tròn ở phía bên kia đường thẳng đê. Hai cung tròn này cắt nhau tại điểm nờ.',
          duration: 6000
        },
        {
          title: 'Bước 4: Đặt thước thẳng nối M và N cắt đường thẳng d tại H (MH ⊥ d)',
          voice: 'Đặt thước thẳng đi qua hai điểm M và N, kẻ đường thẳng cắt d tại H. Đường thẳng MN chính là đường vuông góc hạ từ M xuống d.',
          ttsText: 'Bước 4. Đặt thước thẳng đi qua hai điểm mờ và nờ, rồi kẻ đường thẳng cắt đường thẳng đê tại điểm hát. Khi đó, đường thẳng vừa kẻ chính là đường vuông góc hạ từ điểm mờ xuống đường thẳng đê.',
          duration: 6400
        }
      ]
    },
    {
      id: 'bisector-compass',
      number: 3,
      title: 'Vẽ đường phân giác của một góc bằng Compa',
      shortTitle: '3. Vẽ đường phân giác bằng compa',
      category: 'Dựng hình bằng Compa',
      geoTool: 'bisector',
      altTutorialId: 'bisector-ruler',
      altTutorialLabel: '📏 Xem cách vẽ bằng Thước thẳng',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho góc xOy cần dựng tia phân giác',
          voice: 'Cho trước góc xOy có đỉnh O và hai cạnh là hai tia Ox, Oy. Ta sẽ dùng compa và thước thẳng để dựng tia phân giác chia đôi góc xOy.',
          ttsText: 'Bước 1. Cho trước góc ích ô y, có đỉnh là ô và hai cạnh là hai tia ô ích và ô y. Chúng ta sẽ dùng compa và thước thẳng để dựng tia phân giác chia đôi góc này nhé.',
          duration: 5200
        },
        {
          title: 'Bước 2: Quay cung tròn tâm O cắt hai cạnh Ox, Oy tại A và B',
          voice: 'Đặt mũi nhọn compa tại đỉnh O, mở một bán kính vừa phải. Quay cung tròn cắt tia Ox tại điểm A và cắt tia Oy tại điểm B (OA = OB).',
          ttsText: 'Bước 2. Bạn đặt mũi nhọn compa ngay tại đỉnh ô, mở một bán kính vừa phải. Quay một cung tròn cắt cạnh ô ích tại điểm a, và cắt cạnh ô y tại điểm bê, sao cho đoạn ô a bằng đoạn ô bê.',
          duration: 6000
        },
        {
          title: 'Bước 3: Từ A và B quay 2 cung tròn cùng bán kính cắt nhau tại I',
          voice: 'Giữ nguyên độ mở compa, lần lượt đặt mũi nhọn tại A và tại B, vẽ hai cung tròn nằm bên trong góc xOy cắt nhau tại điểm I.',
          ttsText: 'Bước 3. Giữ nguyên độ mở compa, bạn lần lượt đặt mũi nhọn tại điểm a và điểm bê, rồi quay hai cung tròn nằm ở phía trong góc. Hai cung tròn này sẽ cắt nhau tại điểm y.',
          duration: 6000
        },
        {
          title: 'Bước 4: Dùng thước thẳng nối đỉnh O với giao điểm I được tia phân giác Oz',
          voice: 'Đặt thước thẳng đi qua đỉnh O và giao điểm I. Kẻ tia Oz đi qua I, ta được tia phân giác chia góc xOy thành hai góc bằng nhau.',
          ttsText: 'Bước 4. Đặt thước thẳng nối từ đỉnh ô đi qua giao điểm y. Kẻ tia ô dét đi qua điểm y, ta thu được tia phân giác chia góc ban đầu thành hai phần bằng nhau.',
          duration: 6200
        }
      ]
    },
    {
      id: 'bisector-ruler',
      number: 4,
      title: 'Vẽ đường phân giác bằng Thước thẳng (2 lề song song)',
      shortTitle: '4. Vẽ đường phân giác bằng thước thẳng',
      category: 'Mẹo dựng hình bằng Thước thẳng',
      geoTool: 'bisector',
      altTutorialId: 'bisector-compass',
      altTutorialLabel: '🧭 Xem cách vẽ bằng Compa',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho góc xOy và một cây thước thẳng có hai lề song song',
          voice: 'Khi không có compa, ta vẫn có thể vẽ chính xác tia phân giác của góc xOy chỉ bằng một cây thước thẳng có hai cạnh lề song song.',
          ttsText: 'Bước 1. Khi không có compa trong tay, bạn vẫn có thể vẽ chính xác đường phân giác của góc ích ô y, chỉ bằng một cây thước thẳng có hai cạnh lề song song.',
          duration: 5200
        },
        {
          title: 'Bước 2: Áp lề dưới của thước trùng với cạnh Ox, kẻ đường thẳng theo lề trên',
          voice: 'Đặt thước thẳng sao cho mép dưới của thước trùng khít với cạnh Ox, rồi dùng bút chì kẻ một đường thẳng mờ dọc theo mép trên của thước.',
          ttsText: 'Bước 2. Bạn đặt thước thẳng sao cho mép dưới của thước trùng khít với cạnh ô ích. Sau đó, dùng bút chì kẻ một đường thẳng mờ dọc theo mép trên của thước.',
          duration: 6000
        },
        {
          title: 'Bước 3: Áp lề của thước trùng với cạnh Oy, kẻ đường thứ hai cắt tại I',
          voice: 'Xoay thước thẳng sao cho một mép thước trùng khít với cạnh Oy, kẻ đường thẳng thứ hai dọc theo mép trong của thước cắt đường trước tại I.',
          ttsText: 'Bước 3. Tiếp theo, bạn xoay thước thẳng sao cho một mép thước trùng khít với cạnh ô y, rồi kẻ đường thẳng thứ hai dọc theo mép còn lại. Hai đường thẳng vừa kẻ sẽ cắt nhau tại điểm y.',
          duration: 6200
        },
        {
          title: 'Bước 4: Đặt thước nối đỉnh O với giao điểm I được tia phân giác',
          voice: 'Đặt thước thẳng đi qua đỉnh O và điểm I, kẻ tia OI. Vì điểm I cách đều hai cạnh Ox, Oy một khoảng đúng bằng bề rộng cây thước nên OI là tia phân giác.',
          ttsText: 'Bước 4. Cuối cùng, bạn đặt thước thẳng đi qua đỉnh ô và giao điểm y, rồi kẻ tia ô y. Vì điểm y cách đều hai cạnh góc một khoảng đúng bằng bề rộng cây thước, nên tia vừa kẻ chính là tia phân giác.',
          duration: 6600
        }
      ]
    },
    {
      id: 'tangent-single',
      number: 5,
      title: 'Vẽ tiếp tuyến từ 1 điểm ngoài đến đường tròn',
      shortTitle: '5. Vẽ tiếp tuyến từ 1 điểm đến đường tròn',
      category: 'Đường tròn & Tiếp tuyến',
      geoTool: 'tangent',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho đường tròn (O; R) và điểm P nằm ngoài đường tròn',
          voice: 'Cho đường tròn tâm O bán kính R và điểm P nằm bên ngoài đường tròn. Trước hết, dùng thước nối đoạn thẳng từ tâm O đến điểm P.',
          ttsText: 'Bước 1. Cho đường tròn tâm ô bán kính ờ-rờ, và một điểm pê nằm bên ngoài đường tròn. Trước hết, bạn dùng thước nối đoạn thẳng từ tâm ô đến điểm pê.',
          duration: 5200
        },
        {
          title: 'Bước 2: Xác định trung điểm M của đoạn thẳng OP',
          voice: 'Xác định trung điểm M của đoạn thẳng OP sao cho khoảng cách MO bằng khoảng cách MP.',
          ttsText: 'Bước 2. Bạn xác định trung điểm mờ nằm chính giữa đoạn thẳng ô pê, sao cho đoạn mờ ô bằng đoạn mờ pê.',
          duration: 5000
        },
        {
          title: 'Bước 3: Quay đường tròn tâm M bán kính MO cắt đường tròn (O) tại tiếp điểm T',
          voice: 'Đặt mũi nhọn compa tại trung điểm M, mở bán kính bằng MO rồi quay cung tròn đường kính OP cắt đường tròn (O) tại tiếp điểm T.',
          ttsText: 'Bước 3. Đặt mũi nhọn compa tại trung điểm mờ, mở bán kính bằng đoạn mờ ô, rồi quay một cung tròn. Cung tròn này sẽ cắt đường tròn tâm ô tại tiếp điểm tê.',
          duration: 6000
        },
        {
          title: 'Bước 4: Nối P với tiếp điểm T được tiếp tuyến PT vuông góc với bán kính OT',
          voice: 'Đặt thước thẳng nối điểm P với tiếp điểm T và nối bán kính OT. Do góc OTP chắn nửa đường tròn nên OT ⊥ PT tại tiếp điểm T, vậy PT là tiếp tuyến.',
          ttsText: 'Bước 4. Đặt thước thẳng nối điểm pê với tiếp điểm tê, và nối thêm bán kính ô tê. Khi đó, bán kính ô tê vuông góc với đường thẳng pê tê ngay tại tiếp điểm tê, nên pê tê chính là tiếp tuyến của đường tròn.',
          duration: 6800
        }
      ]
    },
    {
      id: 'two-tangents',
      number: 6,
      title: 'Vẽ hai tiếp tuyến cắt nhau từ 1 điểm đến đường tròn',
      shortTitle: '6. Vẽ hai tiếp tuyến cắt nhau',
      category: 'Đường tròn & Tiếp tuyến',
      geoTool: 'two-tangents',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Nối đoạn thẳng OP và lấy trung điểm M của OP',
          voice: 'Từ điểm P nằm ngoài đường tròn tâm O, ta dùng thước nối đoạn thẳng OP và xác định trung điểm M của đoạn OP.',
          ttsText: 'Bước 1. Từ điểm pê nằm ngoài đường tròn tâm ô, bạn nối đoạn thẳng ô pê, và chấm trung điểm mờ nằm chính giữa đoạn thẳng đó.',
          duration: 5000
        },
        {
          title: 'Bước 2: Quay đường tròn tâm M đường kính OP cắt (O) tại hai tiếp điểm T₁ và T₂',
          voice: 'Đặt compa tại tâm M với bán kính MO, quay đường tròn đường kính OP cắt đường tròn (O) tại hai tiếp điểm đối xứng nhau là T₁ và T₂.',
          ttsText: 'Bước 2. Đặt mũi nhọn compa tại trung điểm mờ với bán kính mờ ô, bạn quay một đường tròn cắt đường tròn ban đầu tại hai tiếp điểm đối xứng nhau, là tê một và tê hai.',
          duration: 6000
        },
        {
          title: 'Bước 3: Dùng thước thẳng kẻ hai tiếp tuyến PT₁ và PT₂',
          voice: 'Dùng thước thẳng lần lượt nối điểm P với tiếp điểm T₁ và nối điểm P với tiếp điểm T₂. Ta thu được hai tiếp tuyến cắt nhau tại P.',
          ttsText: 'Bước 3. Dùng thước thẳng lần lượt nối điểm pê với tiếp điểm tê một, và nối điểm pê với tiếp điểm tê hai. Ta thu được hai đường tiếp tuyến cùng xuất phát từ điểm pê.',
          duration: 6000
        },
        {
          title: 'Bước 4: Kẻ hai bán kính OT₁, OT₂ vuông góc với hai tiếp tuyến tại T₁, T₂',
          voice: 'Kẻ hai bán kính OT₁ và OT₂ vuông góc với hai tiếp tuyến. Theo tính chất hai tiếp tuyến cắt nhau, ta luôn có PT₁ = PT₂ và PO là tia phân giác.',
          ttsText: 'Bước 4. Kẻ hai bán kính từ tâm ô đến hai tiếp điểm tê một và tê hai. Theo tính chất hai tiếp tuyến cắt nhau, khoảng cách từ pê đến hai tiếp điểm luôn bằng nhau, và khi bạn di chuyển điểm pê, cả hai tiếp tuyến cùng bán kính đều sẽ biến đổi theo.',
          duration: 6800
        }
      ]
    },
    {
      id: 'perp-bisector',
      number: 7,
      title: 'Vẽ đường trung trực của đoạn thẳng bằng Compa & Thước',
      shortTitle: '7. Vẽ đường trung trực của đoạn thẳng',
      category: 'Compa & Thước thẳng',
      geoTool: 'perpendicular-bisector',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho đoạn thẳng AB cần dựng đường trung trực',
          voice: 'Cho đoạn thẳng AB. Đường trung trực là đường thẳng đi qua trung điểm của AB và vuông góc với đoạn thẳng AB tại trung điểm đó.',
          ttsText: 'Bước 1. Cho đoạn thẳng a bê. Đường trung trực là đường thẳng đi qua chính giữa đoạn thẳng a bê, và vuông góc với đoạn thẳng đó.',
          duration: 5000
        },
        {
          title: 'Bước 2: Quay cung tròn tâm A với bán kính R lớn hơn một nửa AB',
          voice: 'Đặt mũi nhọn compa tại đầu mút A, mở khẩu độ compa lớn hơn một nửa độ dài đoạn AB, rồi quay cung tròn ở cả phía trên và phía dưới AB.',
          ttsText: 'Bước 2. Bạn đặt mũi nhọn compa tại đầu mút a, mở rộng compa lớn hơn một nửa độ dài đoạn a bê, rồi quay một cung tròn rộng ở cả phía trên và phía dưới.',
          duration: 6000
        },
        {
          title: 'Bước 3: Giữ nguyên bán kính R, quay cung tròn tâm B cắt nhau tại P và Q',
          voice: 'Giữ nguyên độ mở compa, đặt mũi nhọn tại đầu mút B và quay cung tròn thứ hai cắt cung tròn trước tại hai điểm P và Q.',
          ttsText: 'Bước 3. Giữ nguyên độ mở của compa, bạn chuyển mũi nhọn sang đầu mút bê và quay cung tròn thứ hai. Hai cung tròn này cắt nhau tại hai điểm pê và quy.',
          duration: 6000
        },
        {
          title: 'Bước 4: Đặt thước thẳng nối P và Q cắt AB tại trung điểm M',
          voice: 'Dùng thước thẳng kẻ đường thẳng đi qua hai giao điểm P và Q. Đường thẳng PQ vuông góc với AB tại trung điểm M, chính là đường trung trực.',
          ttsText: 'Bước 4. Dùng thước thẳng nối hai giao điểm pê và quy lại với nhau. Đường thẳng vừa kẻ đi qua trung điểm mờ và vuông góc với đoạn a bê, chính là đường trung trực cần dựng.',
          duration: 6400
        }
      ]
    },
    {
      id: 'parallel-line',
      number: 8,
      title: 'Vẽ đường thẳng song song qua 1 điểm bằng Ê-ke & Thước',
      shortTitle: '8. Vẽ đường song song qua 1 điểm bằng ê-ke',
      category: 'Ê-ke & Thước thẳng',
      geoTool: 'parallel',
      durationLabel: '3 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho đường thẳng d và điểm M nằm ngoài đường thẳng d',
          voice: 'Cho đường thẳng d và điểm M nằm ngoài d. Ta cần vẽ đường thẳng đi qua điểm M và song song với đường thẳng d.',
          ttsText: 'Bước 1. Cho đường thẳng đê và điểm mờ nằm ở bên ngoài. Chúng ta cần vẽ một đường thẳng đi qua điểm mờ và song song với đường thẳng đê.',
          duration: 5000
        },
        {
          title: 'Bước 2: Đặt cạnh góc vuông của ê-ke trùng với đường thẳng d, áp thước thẳng làm cữ',
          voice: 'Đặt một cạnh góc vuông của ê-ke trùng với đường thẳng d, sau đó áp sát thước thẳng vào cạnh góc vuông còn lại của ê-ke để làm thanh trượt.',
          ttsText: 'Bước 2. Bạn đặt một cạnh góc vuông của thước ê-ke trùng khít với đường thẳng đê, sau đó áp sát cây thước thẳng vào cạnh góc vuông còn lại để làm đường trượt cố định.',
          duration: 6000
        },
        {
          title: 'Bước 3: Trượt ê-ke dọc theo thước thẳng đến điểm M và kẻ đường song song',
          voice: 'Giữ chặt thước thẳng, trượt nhẹ ê-ke dọc theo mép thước cho đến khi cạnh góc vuông chạm đúng điểm M, rồi kẻ đường thẳng song song với d.',
          ttsText: 'Bước 3. Giữ chặt cây thước thẳng, bạn trượt nhẹ ê-ke dọc theo mép thước cho đến khi cạnh ngang của ê-ke chạm đúng vào điểm mờ. Kẻ một đường thẳng theo mép ê-ke đi qua điểm mờ, ta được đường thẳng song song với đường thẳng đê.',
          duration: 6500
        }
      ]
    },
    {
      id: 'circumcircle-triangle',
      number: 9,
      title: 'Vẽ đường tròn ngoại tiếp tam giác bằng Compa & Thước',
      shortTitle: '9. Vẽ đường tròn ngoại tiếp tam giác',
      category: 'Đường tròn & Tam giác',
      geoTool: 'circumcircle',
      altTutorialId: 'incircle-triangle',
      altTutorialLabel: '🔄 Xem Đường tròn nội tiếp (Bài 10)',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho tam giác ABC, cần tìm tâm đường tròn đi qua cả 3 đỉnh',
          voice: 'Cho tam giác ABC. Để vẽ đường tròn ngoại tiếp đi qua cả ba đỉnh A, B, C, ta cần tìm giao điểm của hai đường trung trực.',
          ttsText: 'Bước 1. Cho tam giác a bê xê. Để vẽ được đường tròn ngoại tiếp đi qua cả ba đỉnh của tam giác, chúng ta cần tìm giao điểm của hai đường trung trực.',
          duration: 5200
        },
        {
          title: 'Bước 2: Dựng đường trung trực thứ nhất của cạnh AB',
          voice: 'Dùng compa và thước thẳng dựng đường trung trực thứ nhất đi qua trung điểm và vuông góc với cạnh AB.',
          ttsText: 'Bước 2. Trước tiên, bạn dựng đường trung trực thứ nhất, đi qua trung điểm và vuông góc với cạnh a bê.',
          duration: 5400
        },
        {
          title: 'Bước 3: Dựng đường trung trực thứ hai của cạnh BC cắt nhau tại tâm O',
          voice: 'Tiếp tục dựng đường trung trực thứ hai của cạnh BC. Hai đường trung trực cắt nhau tại tâm O cách đều cả ba đỉnh A, B, C.',
          ttsText: 'Bước 3. Tiếp theo, bạn dựng đường trung trực thứ hai của cạnh bê xê. Hai đường trung trực này cắt nhau tại điểm ô, điểm ô cách đều cả ba đỉnh nên chính là tâm đường tròn ngoại tiếp.',
          duration: 6000
        },
        {
          title: 'Bước 4: Đặt compa tại tâm O, mở bán kính OA và quay đường tròn đi qua A, B, C',
          voice: 'Đặt mũi nhọn compa tại tâm O, mở đầu chì chạm đúng đỉnh A rồi quay một vòng tròn đi qua cả ba đỉnh A, B và C.',
          ttsText: 'Bước 4. Đặt mũi nhọn compa tại tâm ô, mở đầu bút chì chạm đúng vào đỉnh a, rồi nhẹ nhàng quay một vòng tròn. Đường tròn tâm ô sẽ đi qua chính xác cả ba đỉnh a, bê và xê của tam giác.',
          duration: 6600
        }
      ]
    },
    {
      id: 'incircle-triangle',
      number: 10,
      title: 'Vẽ đường tròn nội tiếp tam giác bằng Compa, Ê-ke & Thước',
      shortTitle: '10. Vẽ đường tròn nội tiếp tam giác',
      category: 'Đường tròn & Tam giác',
      geoTool: 'incircle',
      altTutorialId: 'circumcircle-triangle',
      altTutorialLabel: '🔄 Xem Đường tròn ngoại tiếp (Bài 9)',
      durationLabel: '4 bước · Giọng đọc tự nhiên',
      steps: [
        {
          title: 'Bước 1: Cho tam giác ABC, cần tìm tâm đường tròn tiếp xúc với cả 3 cạnh',
          voice: 'Cho tam giác ABC. Để vẽ đường tròn nội tiếp nằm bên trong và tiếp xúc với cả ba cạnh của tam giác, ta cần tìm giao điểm hai tia phân giác.',
          ttsText: 'Bước 1. Cho tam giác a bê xê. Để vẽ được đường tròn nội tiếp nằm ở bên trong và tiếp xúc với cả ba cạnh của tam giác, chúng ta cần tìm giao điểm của hai tia phân giác trong.',
          duration: 5400
        },
        {
          title: 'Bước 2: Dựng hai tia phân giác của góc B và góc C cắt nhau tại tâm I',
          voice: 'Dùng compa và thước thẳng dựng tia phân giác của góc B và tia phân giác của góc C. Hai tia này cắt nhau tại tâm đường tròn nội tiếp I.',
          ttsText: 'Bước 2. Bạn dùng compa và thước thẳng dựng tia phân giác của góc bê và tia phân giác của góc xê. Hai tia phân giác này cắt nhau tại điểm y, điểm y cách đều cả ba cạnh nên là tâm đường tròn nội tiếp.',
          duration: 6000
        },
        {
          title: 'Bước 3: Dùng ê-ke hạ đường vuông góc IH từ tâm I xuống cạnh BC để tìm bán kính',
          voice: 'Đặt thước ê-ke hạ đoạn thẳng vuông góc từ tâm I xuống cạnh BC tại tiếp điểm H. Độ dài đoạn IH chính là bán kính đường tròn nội tiếp.',
          ttsText: 'Bước 3. Đặt thước ê-ke hạ đường vuông góc từ tâm y xuống cạnh bê xê tại tiếp điểm hát. Độ dài đoạn thẳng y hát chính là bán kính của đường tròn nội tiếp.',
          duration: 6000
        },
        {
          title: 'Bước 4: Đặt compa tại tâm I, mở bán kính IH và quay đường tròn nội tiếp tam giác',
          voice: 'Đặt mũi nhọn compa tại tâm I, mở đầu chì đến đúng tiếp điểm H rồi quay một vòng tròn. Đường tròn tâm I tiếp xúc vừa khít với cả ba cạnh AB, BC, CA.',
          ttsText: 'Bước 4. Đặt mũi nhọn compa tại tâm y, mở đầu bút chì chạm đúng vào tiếp điểm hát, rồi quay một vòng tròn. Ta thu được đường tròn nội tiếp tâm y tiếp xúc vừa khít với cả ba cạnh của tam giác a bê xê.',
          duration: 6600
        }
      ]
    }
  ];

  // Trạng thái trình phát video hướng dẫn
  const playerState = {
    isOpen: false,
    currentTutorialIndex: 0,
    currentStepIndex: 0,
    isPlaying: false,
    isSpeaking: false,
    speechFinishedAt: 0,
    stepProgress: 0, // 0 -> 1
    lastFrameTime: 0,
    rafId: null,
    speechTimers: [],
    voiceEnabled: true,
    playbackSpeed: 1.0,
    spokenStepKey: null,
    cachedVoice: null
  };

  // ==========================================================================
  // 1. HỆ THỐNG GIỌNG ĐỌC TIẾNG VIỆT TỰ NHIÊN (CHIA NHỊP CÂU & ĐỒNG BỘ HƠI THỞ)
  // ==========================================================================
  function clearSpeechTimers() {
    while (playerState.speechTimers.length > 0) {
      const id = playerState.speechTimers.pop();
      try {
        clearTimeout(id);
      } catch (e) {}
    }
  }

  function stopSpeech() {
    clearSpeechTimers();
    playerState.isSpeaking = false;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }

  // Chọn giọng đọc tiếng Việt tự nhiên nhất trên thiết bị (Ưu tiên giọng Neural / Natural / Enhanced / Linh)
  function pickVietnameseVoice() {
    try {
      if (!('speechSynthesis' in window) || !window.speechSynthesis) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      if (!voices.length) return playerState.cachedVoice || null;

      const viVoices = voices.filter(v =>
        (v.lang && v.lang.toLowerCase().startsWith('vi')) ||
        (v.name && /viet|việt|linh|hoaimy|namminh|an|minh/i.test(v.name))
      );

      if (viVoices.length > 0) {
        // Xếp hạng độ tự nhiên của giọng đọc
        const scoreVoice = (v) => {
          const name = (v.name || '').toLowerCase();
          let s = 10;
          if (name.includes('natural') || name.includes('online')) s += 50; // Microsoft HoaiMy/NamMinh Natural
          if (name.includes('premium') || name.includes('enhanced')) s += 40; // Apple Linh Premium/Enhanced
          if (name.includes('google')) s += 30; // Google Tiếng Việt
          if (name.includes('linh') || name.includes('hoaimy')) s += 20;
          if (v.localService === false) s += 10;
          return s;
        };
        viVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
        playerState.cachedVoice = viVoices[0];
        return viVoices[0];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Tách đoạn thuyết minh thành các mệnh đề / câu ngắn theo nhịp thở tự nhiên của người thật
  function splitIntoNaturalPhrases(text) {
    if (!text) return [];
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function speakStepText(text, onEndCallback) {
    stopSpeech();
    if (!playerState.voiceEnabled || !text) {
      playerState.isSpeaking = false;
      playerState.speechFinishedAt = Date.now();
      return;
    }
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function') {
        const phrases = splitIntoNaturalPhrases(text);
        if (phrases.length === 0) return;

        playerState.isSpeaking = true;
        playerState.speechFinishedAt = 0;
        const viVoice = pickVietnameseVoice();

        let idx = 0;
        const speakNextPhrase = () => {
          if (!playerState.voiceEnabled || !playerState.isOpen) {
            playerState.isSpeaking = false;
            return;
          }
          if (idx >= phrases.length) {
            playerState.isSpeaking = false;
            playerState.speechFinishedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            if (typeof onEndCallback === 'function') onEndCallback();
            return;
          }

          const phrase = phrases[idx++];
          const utter = new window.SpeechSynthesisUtterance(phrase);
          utter.lang = 'vi-VN';
          // Tốc độ 0.94 và cao độ 1.02 giúp giọng tiếng Việt mềm mại, tròn vành rõ chữ, không bị gấp gáp
          utter.rate = Math.max(0.75, Math.min(1.35, playerState.playbackSpeed * 0.94));
          utter.pitch = 1.02;
          utter.volume = 1.0;
          if (viVoice) {
            utter.voice = viVoice;
          }

          utter.onend = () => {
            if (idx < phrases.length && typeof setTimeout === 'function') {
              // Nghỉ lấy hơi tự nhiên 180ms giữa các câu
              const tid = setTimeout(speakNextPhrase, 180);
              playerState.speechTimers.push(tid);
            } else {
              speakNextPhrase();
            }
          };

          utter.onerror = () => {
            playerState.isSpeaking = false;
            playerState.speechFinishedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
          };

          window.speechSynthesis.speak(utter);
        };

        speakNextPhrase();

        // Chốt an toàn phòng trường hợp trình duyệt không bắn sự kiện onend
        if (typeof setTimeout === 'function') {
          const safetyId = setTimeout(() => {
            if (playerState.isSpeaking) {
              playerState.isSpeaking = false;
              playerState.speechFinishedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            }
          }, 14500);
          playerState.speechTimers.push(safetyId);
        }
      }
    } catch (e) {
      playerState.isSpeaking = false;
    }
  }

  // ==========================================================================
  // 2. BỘ VẼ DỤNG CỤ HÌNH HỌC TRỰC QUAN (Ê-KE, COMPA, THƯỚC THẲNG, BÚT CHÌ)
  // ==========================================================================
  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }

  function easeInOutCubic(t) {
    const x = clamp01(t);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function drawGridPaperBackground(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = '#fbfaf6';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(48, 73, 60, 0.065)';
    ctx.lineWidth = 1;
    const grid = 24;
    ctx.beginPath();
    for (let x = grid; x < w; x += grid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = grid; y < h; y += grid) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawPointWithLabel(ctx, x, y, label, color, offsetX, offsetY, scale) {
    const s = scale === undefined ? 1 : scale;
    if (s <= 0.01) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 4.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = color || '#184e3a';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    if (label) {
      ctx.font = 'italic 700 15px "STIX Two Math", "Cambria Math", Georgia, serif';
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      const lx = x + (offsetX !== undefined ? offsetX : 8);
      const ly = y + (offsetY !== undefined ? offsetY : -8);
      ctx.strokeText(label, lx, ly);
      ctx.fillStyle = color || '#184e3a';
      ctx.fillText(label, lx, ly);
    }
    ctx.restore();
  }

  function drawAnimatedSegment(ctx, x1, y1, x2, y2, progress, color, width, dash) {
    const p = clamp01(progress);
    if (p <= 0.001) return { x: x1, y: y1 };
    const curX = x1 + (x2 - x1) * p;
    const curY = y1 + (y2 - y1) * p;
    ctx.save();
    ctx.beginPath();
    if (dash && dash.length) ctx.setLineDash(dash);
    ctx.strokeStyle = color || '#28634e';
    ctx.lineWidth = width || 2.4;
    ctx.lineCap = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    ctx.restore();
    return { x: curX, y: curY };
  }

  function drawAnimatedArc(ctx, cx, cy, r, startAngle, endAngle, progress, color, width, dash) {
    const p = clamp01(progress);
    if (p <= 0.001) return { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle), angle: startAngle };
    const curAngle = startAngle + (endAngle - startAngle) * p;
    ctx.save();
    ctx.beginPath();
    if (dash && dash.length) ctx.setLineDash(dash);
    ctx.strokeStyle = color || '#d97706';
    ctx.lineWidth = width || 1.8;
    ctx.lineCap = 'round';
    ctx.arc(cx, cy, r, startAngle, curAngle, endAngle < startAngle);
    ctx.stroke();
    ctx.restore();
    return {
      x: cx + r * Math.cos(curAngle),
      y: cy + r * Math.sin(curAngle),
      angle: curAngle
    };
  }

  function drawRightAngleSymbol(ctx, vx, vy, ux1, uy1, ux2, uy2, size, color) {
    const s = size || 12;
    const p1x = vx + ux1 * s;
    const p1y = vy + uy1 * s;
    const p2x = vx + ux2 * s;
    const p2y = vy + uy2 * s;
    const p12x = vx + ux1 * s + ux2 * s;
    const p12y = vy + uy1 * s + uy2 * s;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color || '#dc2626';
    ctx.lineWidth = 1.6;
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p12x, p12y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();
    ctx.restore();
  }

  // Vẽ cây Compa 2 chân sinh động (chân kim cố định tại (cx, cy), chân bút chì tại (px, py))
  function drawCompassTool(ctx, cx, cy, px, py, alpha) {
    if (alpha !== undefined && alpha <= 0.01) return;
    ctx.save();
    if (alpha !== undefined) ctx.globalAlpha = clamp01(alpha);

    const mx = (cx + px) / 2;
    const my = (cy + py) / 2;
    const dist = Math.hypot(px - cx, py - cy);
    const legH = Math.max(68, Math.min(125, dist * 0.85));
    const hx = mx;
    const hy = my - legH;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Chân trụ kim
    ctx.beginPath();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.moveTo(hx, hy);
    ctx.lineTo(cx, cy - 10);
    ctx.stroke();

    // Mũi kim nhọn
    ctx.beginPath();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Chân gắn bút chì
    ctx.beginPath();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4.5;
    ctx.moveTo(hx, hy);
    ctx.lineTo(px, py - 12);
    ctx.stroke();

    // Đầu bút chì
    ctx.beginPath();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.moveTo(px, py - 12);
    ctx.lineTo(px, py - 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#1e293b';
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();

    // Khớp nối đỉnh compa & núm cầm
    ctx.beginPath();
    ctx.fillStyle = '#1e293b';
    ctx.arc(hx, hy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.moveTo(hx, hy - 7);
    ctx.lineTo(hx, hy - 20);
    ctx.stroke();

    ctx.restore();
  }

  // Vẽ Thước thẳng (Straightedge Ruler) có vạch chia milimet
  function drawRulerTool(ctx, x1, y1, x2, y2, rulerWidth, alpha, offsetSide) {
    if (alpha !== undefined && alpha <= 0.01) return;
    ctx.save();
    if (alpha !== undefined) ctx.globalAlpha = clamp01(alpha);

    const ang = Math.atan2(y2 - y1, x2 - x1);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const rw = rulerWidth || 28;
    const side = offsetSide !== undefined ? offsetSide : 1;

    ctx.translate(x1, y1);
    ctx.rotate(ang);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    const yTop = side > 0 ? 0 : -rw;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.84)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-18, yTop, len + 36, rw, 4);
    } else {
      ctx.rect(-18, yTop, len + 36, rw);
    }
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let d = -10; d <= len + 20; d += 10) {
      const tickH = (d % 50 === 0) ? 9 : ((d % 20 === 0) ? 6 : 4);
      if (side > 0) {
        ctx.moveTo(d, 0);
        ctx.lineTo(d, tickH);
      } else {
        ctx.moveTo(d, 0);
        ctx.lineTo(d, -tickH);
      }
    }
    ctx.stroke();

    ctx.restore();
  }

  // Vẽ Ê-ke vuông (Set Square) với góc vuông tại (vx, vy), cạnh đáy leg1, cạnh đứng leg2, có vạch chia cm
  function drawSetSquareTool(ctx, vx, vy, angleRad, leg1, leg2, alpha) {
    if (alpha !== undefined && alpha <= 0.01) return;
    ctx.save();
    if (alpha !== undefined) ctx.globalAlpha = clamp01(alpha);

    ctx.translate(vx, vy);
    ctx.rotate(angleRad);

    const a = leg1 || 135;
    const b = leg2 || 155;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = 'rgba(209, 250, 229, 0.85)';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(a, 0);
    ctx.lineTo(0, -b);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ô tam giác rỗng bên trong ê-ke
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fbfaf6';
    ctx.beginPath();
    ctx.moveTo(22, -20);
    ctx.lineTo(a * 0.56, -20);
    ctx.lineTo(22, -b * 0.56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vạch chia milimet trên cạnh đứng và cạnh đáy của ê-ke
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 10; y < b - 12; y += 10) {
      const tickW = (y % 50 === 0) ? 8 : ((y % 20 === 0) ? 5 : 3.5);
      ctx.moveTo(0, -y);
      ctx.lineTo(tickW, -y);
    }
    for (let x = 10; x < a - 12; x += 10) {
      const tickH = (x % 50 === 0) ? 8 : ((x % 20 === 0) ? 5 : 3.5);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, -tickH);
    }
    ctx.stroke();

    // Nhãn chữ Ê-KE trên thân thước
    ctx.font = '700 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#065f46';
    ctx.fillText('Ê-KE 90°', 26, -8);

    ctx.restore();
  }

  // Vẽ đầu bút chì đang kẻ tại (px, py)
  function drawPencilTip(ctx, px, py, alpha) {
    if (alpha !== undefined && alpha <= 0.01) return;
    ctx.save();
    if (alpha !== undefined) ctx.globalAlpha = clamp01(alpha);
    ctx.translate(px, py);
    ctx.rotate(-Math.PI / 4);

    ctx.fillStyle = '#184e3a';
    ctx.fillRect(8, -4, 34, 8);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(2, -1.5);
    ctx.lineTo(8, -4);
    ctx.lineTo(8, 4);
    ctx.lineTo(2, 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(2.5, -1.5);
    ctx.lineTo(2.5, 1.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // ==========================================================================
  // 3. KỊCH BẢN HOẠT ẢNH TỪNG BÀI HƯỚNG DẪN (60FPS CANVAS SCENE RENDERERS)
  // ==========================================================================
  function renderScene(ctx, w, h, tutorialId, stepIdx, rawT) {
    drawGridPaperBackground(ctx, w, h);

    // ------------------------------------------------------------------------
    // BÀI 1: VẼ ĐƯỜNG VUÔNG GÓC TỪ 1 ĐIỂM ĐẾN 1 ĐƯỜNG THẲNG BẰNG Ê-KE
    // ------------------------------------------------------------------------
    if (tutorialId === 'perp-point-line-eke') {
      const yLine = 240;
      const Mx = 345, My = 95;
      const Hx = Mx, Hy = yLine;
      const startEkeX = 165;

      // Bước 1: Đường thẳng d và điểm M
      const lineP = stepIdx === 0 ? clamp01(rawT * 1.6) : 1;
      drawAnimatedSegment(ctx, 90, yLine, w - 90, yLine, lineP, '#1e293b', 2.6);
      if (lineP > 0.8) {
        ctx.save();
        ctx.font = 'italic 700 15px Georgia, serif';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('d', w - 82, yLine - 8);
        ctx.restore();
      }
      const mScale = stepIdx === 0 ? clamp01((rawT - 0.4) * 2.2) : 1;
      drawPointWithLabel(ctx, Mx, My, 'M', '#184e3a', 10, -8, mScale);

      // Bước 2: Đặt ê-ke sao cho 1 cạnh góc vuông trùng với đường thẳng d
      if (stepIdx === 1) {
        const appear = easeInOutCubic(clamp01(rawT * 1.5));
        const dropY = yLine - (1 - appear) * 28;
        drawSetSquareTool(ctx, startEkeX, dropY, 0, 130, 165, appear);
        if (appear > 0.8) {
          drawRightAngleSymbol(ctx, startEkeX, yLine, 1, 0, 0, -1, 13, '#dc2626');
        }
      }

      // Bước 3: Trượt nhẹ ê-ke dọc theo đường thẳng d đến khi cạnh góc vuông đứng đi qua điểm M
      if (stepIdx === 2) {
        const slideT = easeInOutCubic(clamp01((rawT - 0.08) / 0.78));
        const curX = startEkeX + (Mx - startEkeX) * slideT;
        // Vẽ mũi tên chỉ hướng trượt dọc theo d
        ctx.save();
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(startEkeX + 20, yLine + 24);
        ctx.lineTo(Mx, yLine + 24);
        ctx.stroke();
        ctx.restore();

        drawSetSquareTool(ctx, curX, yLine, 0, 130, 165, 0.95);
        drawRightAngleSymbol(ctx, curX, yLine, 1, 0, 0, -1, 13, '#dc2626');
        drawPointWithLabel(ctx, Mx, My, 'M', '#184e3a', 10, -8, 1);
      }

      // Bước 4: Giữ ê-ke và dùng bút chì kẻ dọc theo cạnh góc vuông đứng từ M xuống H
      if (stepIdx >= 3) {
        const pLine = clamp01((rawT - 0.1) / 0.65);
        const ekeAlpha = rawT < 0.85 ? 0.92 : Math.max(0.28, 0.92 - (rawT - 0.85) * 4);
        drawSetSquareTool(ctx, Mx, yLine, 0, 130, 165, ekeAlpha);
        const tip = drawAnimatedSegment(ctx, Mx, My - 14, Hx, Hy + 18, pLine, '#16a34a', 2.9);
        if (pLine > 0 && pLine < 1) {
          drawPencilTip(ctx, tip.x, tip.y, 1);
        }
        drawPointWithLabel(ctx, Mx, My, 'M', '#184e3a', 10, -8, 1);
        if (rawT > 0.58) {
          drawRightAngleSymbol(ctx, Hx, Hy, 1, 0, 0, -1, 13, '#dc2626');
          drawPointWithLabel(ctx, Hx, Hy, 'H', '#dc2626', -22, 18, 1);
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 2: VẼ ĐƯỜNG VUÔNG GÓC TỪ 1 ĐIỂM ĐẾN 1 ĐƯỜNG THẲNG BẰNG COMPA
    // ------------------------------------------------------------------------
    if (tutorialId === 'perp-point-line') {
      const yLine = 215;
      const Mx = w / 2, My = 105;
      const R1 = 148;
      const dy = yLine - My;
      const dx = Math.sqrt(R1 * R1 - dy * dy);
      const Ax = Mx - dx, Ay = yLine;
      const Bx = Mx + dx, By = yLine;
      const R2 = 135;
      const dy2 = Math.sqrt(R2 * R2 - dx * dx);
      const Nx = Mx, Ny = yLine + dy2;
      const Hx = Mx, Hy = yLine;

      const lineP = stepIdx === 0 ? clamp01(rawT * 1.6) : 1;
      drawAnimatedSegment(ctx, 110, yLine, w - 110, yLine, lineP, '#1e293b', 2.6);
      if (lineP > 0.8) {
        ctx.save();
        ctx.font = 'italic 700 15px Georgia, serif';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('d', w - 102, yLine - 8);
        ctx.restore();
      }
      const mScale = stepIdx === 0 ? clamp01((rawT - 0.45) * 2.2) : 1;
      drawPointWithLabel(ctx, Mx, My, 'M', '#184e3a', 10, -8, mScale);

      if (stepIdx >= 1) {
        const aStart = Math.atan2(Ay - My, Ax - Mx) + 0.18;
        const aEnd = Math.atan2(By - My, Bx - Mx) - 0.18;
        const pArc = stepIdx === 1 ? clamp01((rawT - 0.1) / 0.75) : 1;
        const tip = drawAnimatedArc(ctx, Mx, My, R1, aStart, aEnd, pArc, '#d97706', 1.8, [5, 4]);
        if (stepIdx === 1) {
          drawCompassTool(ctx, Mx, My, tip.x, tip.y, rawT < 0.9 ? 1 : (1 - (rawT - 0.9) * 10));
        }
        if (stepIdx > 1 || rawT > 0.35) {
          drawPointWithLabel(ctx, Ax, Ay, 'A', '#b45309', -18, 20, 1);
        }
        if (stepIdx > 1 || rawT > 0.78) {
          drawPointWithLabel(ctx, Bx, By, 'B', '#b45309', 10, 20, 1);
        }
      }

      if (stepIdx >= 2) {
        const angAN = Math.atan2(Ny - Ay, Nx - Ax);
        const angBN = Math.atan2(Ny - By, Nx - Bx);
        const pArcA = stepIdx === 2 ? clamp01(rawT / 0.45) : 1;
        const pArcB = stepIdx === 2 ? clamp01((rawT - 0.45) / 0.45) : 1;
        const tipA = drawAnimatedArc(ctx, Ax, Ay, R2, angAN - 0.28, angAN + 0.28, pArcA, '#0284c7', 1.8, [4, 4]);
        const tipB = drawAnimatedArc(ctx, Bx, By, R2, angBN + 0.28, angBN - 0.28, pArcB, '#0284c7', 1.8, [4, 4]);
        if (stepIdx === 2) {
          if (rawT < 0.48) {
            drawCompassTool(ctx, Ax, Ay, tipA.x, tipA.y, 1);
          } else {
            drawCompassTool(ctx, Bx, By, tipB.x, tipB.y, rawT < 0.92 ? 1 : (1 - (rawT - 0.92) * 12));
          }
        }
        if (stepIdx > 2 || rawT > 0.82) {
          drawPointWithLabel(ctx, Nx, Ny, 'N', '#0284c7', 10, 6, 1);
        }
      }

      if (stepIdx >= 3) {
        const pLine = clamp01((rawT - 0.15) / 0.65);
        drawRulerTool(ctx, Mx, My - 18, Nx, Ny + 18, 26, rawT < 0.85 ? 0.9 : 0.25, 1);
        const tip = drawAnimatedSegment(ctx, Mx, My - 12, Nx, Ny + 12, pLine, '#16a34a', 2.8);
        if (pLine < 1) drawPencilTip(ctx, tip.x, tip.y, 1);
        if (rawT > 0.55) {
          drawRightAngleSymbol(ctx, Hx, Hy, 1, 0, 0, -1, 13, '#dc2626');
          drawPointWithLabel(ctx, Hx, Hy, 'H', '#dc2626', -20, -8, 1);
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 3: VẼ ĐƯỜNG PHÂN GIÁC BẰNG COMPA
    // ------------------------------------------------------------------------
    if (tutorialId === 'bisector-compass') {
      const Ox = 165, Oy = 275;
      const angX = 0.05;
      const angY = -0.82;
      const rayLen = 320;
      const R1 = 135;
      const Ax = Ox + R1 * Math.cos(angX), Ay = Oy + R1 * Math.sin(angX);
      const Bx = Ox + R1 * Math.cos(angY), By = Oy + R1 * Math.sin(angY);
      const midAng = (angX + angY) / 2;
      const R2 = 125;
      const halfChord = R1 * Math.sin(Math.abs(angX - angY) / 2);
      const dOI = R1 * Math.cos(Math.abs(angX - angY) / 2) + Math.sqrt(Math.max(0, R2 * R2 - halfChord * halfChord));
      const Ix = Ox + dOI * Math.cos(midAng), Iy = Oy + dOI * Math.sin(midAng);

      const pRays = stepIdx === 0 ? clamp01(rawT * 1.5) : 1;
      drawAnimatedSegment(ctx, Ox, Oy, Ox + rayLen * Math.cos(angX), Oy + rayLen * Math.sin(angX), pRays, '#1e293b', 2.5);
      drawAnimatedSegment(ctx, Ox, Oy, Ox + rayLen * Math.cos(angY), Oy + rayLen * Math.sin(angY), pRays, '#1e293b', 2.5);
      drawPointWithLabel(ctx, Ox, Oy, 'O', '#1e293b', -22, 6, 1);

      if (stepIdx >= 1) {
        const pArc = stepIdx === 1 ? clamp01((rawT - 0.1) / 0.75) : 1;
        const tip = drawAnimatedArc(ctx, Ox, Oy, R1, angX + 0.12, angY - 0.12, pArc, '#d97706', 1.9, [5, 4]);
        if (stepIdx === 1) {
          drawCompassTool(ctx, Ox, Oy, tip.x, tip.y, rawT < 0.9 ? 1 : 0.2);
        }
        if (stepIdx > 1 || rawT > 0.25) drawPointWithLabel(ctx, Ax, Ay, 'A', '#b45309', -4, 22, 1);
        if (stepIdx > 1 || rawT > 0.78) drawPointWithLabel(ctx, Bx, By, 'B', '#b45309', -18, -10, 1);
      }

      if (stepIdx >= 2) {
        const angAI = Math.atan2(Iy - Ay, Ix - Ax);
        const angBI = Math.atan2(Iy - By, Ix - Bx);
        const pArcA = stepIdx === 2 ? clamp01(rawT / 0.45) : 1;
        const pArcB = stepIdx === 2 ? clamp01((rawT - 0.45) / 0.45) : 1;
        const tipA = drawAnimatedArc(ctx, Ax, Ay, R2, angAI + 0.35, angAI - 0.35, pArcA, '#0284c7', 1.9, [4, 4]);
        const tipB = drawAnimatedArc(ctx, Bx, By, R2, angBI - 0.35, angBI + 0.35, pArcB, '#0284c7', 1.9, [4, 4]);
        if (stepIdx === 2) {
          if (rawT < 0.48) drawCompassTool(ctx, Ax, Ay, tipA.x, tipA.y, 1);
          else drawCompassTool(ctx, Bx, By, tipB.x, tipB.y, rawT < 0.92 ? 1 : 0.2);
        }
        if (stepIdx > 2 || rawT > 0.82) drawPointWithLabel(ctx, Ix, Iy, 'I', '#0284c7', 10, -6, 1);
      }

      if (stepIdx >= 3) {
        const zx = Ox + (rayLen + 20) * Math.cos(midAng);
        const zy = Oy + (rayLen + 20) * Math.sin(midAng);
        const pLine = clamp01((rawT - 0.12) / 0.68);
        drawRulerTool(ctx, Ox, Oy, zx, zy, 26, rawT < 0.85 ? 0.88 : 0.25, 1);
        const tip = drawAnimatedSegment(ctx, Ox, Oy, zx, zy, pLine, '#16a34a', 2.8);
        if (pLine < 1) drawPencilTip(ctx, tip.x, tip.y, 1);
        if (rawT > 0.7) {
          drawAnimatedArc(ctx, Ox, Oy, 44, angX, midAng, 1, '#16a34a', 1.8);
          drawAnimatedArc(ctx, Ox, Oy, 50, midAng, angY, 1, '#16a34a', 1.8);
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 4: VẼ ĐƯỜNG PHÂN GIÁC BẰNG THƯỚC THẲNG (2 LỀ SONG SONG)
    // ------------------------------------------------------------------------
    if (tutorialId === 'bisector-ruler') {
      const Ox = 160, Oy = 275;
      const angX = 0.04;
      const angY = -0.80;
      const rayLen = 330;
      const rw = 38;
      const midAng = (angX + angY) / 2;
      const halfDiff = Math.abs(angX - angY) / 2;
      const dOI = rw / Math.sin(halfDiff);
      const Ix = Ox + dOI * Math.cos(midAng);
      const Iy = Oy + dOI * Math.sin(midAng);

      const pRays = stepIdx === 0 ? clamp01(rawT * 1.5) : 1;
      drawAnimatedSegment(ctx, Ox, Oy, Ox + rayLen * Math.cos(angX), Oy + rayLen * Math.sin(angX), pRays, '#1e293b', 2.5);
      drawAnimatedSegment(ctx, Ox, Oy, Ox + rayLen * Math.cos(angY), Oy + rayLen * Math.sin(angY), pRays, '#1e293b', 2.5);
      drawPointWithLabel(ctx, Ox, Oy, 'O', '#1e293b', -22, 6, 1);

      if (stepIdx === 0 && rawT > 0.45) {
        drawRulerTool(ctx, 240, 120, 490, 120, rw, clamp01((rawT - 0.45) * 2), 1);
      }

      const nx1 = Math.sin(angX), ny1 = -Math.cos(angX);
      const p1Start = { x: Ox + nx1 * rw, y: Oy + ny1 * rw };
      const p1End = { x: p1Start.x + (rayLen - 20) * Math.cos(angX), y: p1Start.y + (rayLen - 20) * Math.sin(angX) };

      if (stepIdx >= 1) {
        const pLine1 = stepIdx === 1 ? clamp01((rawT - 0.2) / 0.65) : 1;
        if (stepIdx === 1) {
          drawRulerTool(ctx, Ox, Oy, Ox + (rayLen - 20) * Math.cos(angX), Oy + (rayLen - 20) * Math.sin(angX), rw, 0.9, -1);
        }
        const tip1 = drawAnimatedSegment(ctx, p1Start.x, p1Start.y, p1End.x, p1End.y, pLine1, '#d97706', 1.9, [6, 4]);
        if (stepIdx === 1 && pLine1 > 0 && pLine1 < 1) drawPencilTip(ctx, tip1.x, tip1.y, 1);
      }

      const nx2 = -Math.sin(angY), ny2 = Math.cos(angY);
      const p2Start = { x: Ox + nx2 * rw, y: Oy + ny2 * rw };
      const p2End = { x: p2Start.x + (rayLen - 20) * Math.cos(angY), y: p2Start.y + (rayLen - 20) * Math.sin(angY) };

      if (stepIdx >= 2) {
        const pLine2 = stepIdx === 2 ? clamp01((rawT - 0.2) / 0.65) : 1;
        if (stepIdx === 2) {
          drawRulerTool(ctx, Ox, Oy, Ox + (rayLen - 20) * Math.cos(angY), Oy + (rayLen - 20) * Math.sin(angY), rw, 0.9, 1);
        }
        const tip2 = drawAnimatedSegment(ctx, p2Start.x, p2Start.y, p2End.x, p2End.y, pLine2, '#0284c7', 1.9, [6, 4]);
        if (stepIdx === 2 && pLine2 > 0 && pLine2 < 1) drawPencilTip(ctx, tip2.x, tip2.y, 1);
        if (stepIdx > 2 || rawT > 0.78) {
          drawPointWithLabel(ctx, Ix, Iy, 'I', '#0284c7', 10, -6, 1);
        }
      }

      if (stepIdx >= 3) {
        const zx = Ox + (rayLen + 15) * Math.cos(midAng);
        const zy = Oy + (rayLen + 15) * Math.sin(midAng);
        const pLine3 = clamp01((rawT - 0.12) / 0.68);
        drawRulerTool(ctx, Ox, Oy, zx, zy, 26, rawT < 0.85 ? 0.88 : 0.25, 1);
        const tip3 = drawAnimatedSegment(ctx, Ox, Oy, zx, zy, pLine3, '#16a34a', 2.8);
        if (pLine3 < 1) drawPencilTip(ctx, tip3.x, tip3.y, 1);
        if (rawT > 0.7) {
          drawAnimatedArc(ctx, Ox, Oy, 42, angX, midAng, 1, '#16a34a', 1.8);
          drawAnimatedArc(ctx, Ox, Oy, 48, midAng, angY, 1, '#16a34a', 1.8);
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 5: VẼ TIẾP TUYẾN TỪ 1 ĐIỂM ĐẾN ĐƯỜNG TRÒN
    // ------------------------------------------------------------------------
    if (tutorialId === 'tangent-single') {
      const Ox = 210, Oy = 185, R = 84;
      const Px = 455, Py = 185;
      const Mx = (Ox + Px) / 2, My = (Oy + Py) / 2;
      const RM = Math.hypot(Px - Ox, Py - Oy) / 2;
      const alpha = Math.acos(R / (2 * RM));
      const Tx = Ox + R * Math.cos(-alpha);
      const Ty = Oy + R * Math.sin(-alpha);

      drawAnimatedArc(ctx, Ox, Oy, R, 0, Math.PI * 2, 1, '#1e293b', 2.4);
      drawPointWithLabel(ctx, Ox, Oy, 'O', '#1e293b', -18, 6, 1);
      drawPointWithLabel(ctx, Px, Py, 'P', '#184e3a', 10, 6, 1);

      const pOP = stepIdx === 0 ? clamp01((rawT - 0.2) / 0.65) : 1;
      drawAnimatedSegment(ctx, Ox, Oy, Px, Py, pOP, '#64748b', 1.8, [5, 4]);

      if (stepIdx >= 1) {
        const mScale = stepIdx === 1 ? clamp01(rawT * 2) : 1;
        drawPointWithLabel(ctx, Mx, My, 'M', '#b45309', -6, 22, mScale);
      }

      if (stepIdx >= 2) {
        const pArcM = stepIdx === 2 ? clamp01((rawT - 0.1) / 0.72) : 1;
        const tipM = drawAnimatedArc(ctx, Mx, My, RM, Math.PI, 0, pArcM, '#d97706', 1.8, [5, 4]);
        if (stepIdx === 2) {
          drawCompassTool(ctx, Mx, My, tipM.x, tipM.y, rawT < 0.88 ? 1 : 0.2);
        }
        if (stepIdx > 2 || rawT > 0.55) {
          drawPointWithLabel(ctx, Tx, Ty, 'T (Tiếp điểm)', '#dc2626', -25, -12, 1);
        }
      }

      if (stepIdx >= 3) {
        const pTan = clamp01(rawT / 0.5);
        const pRad = clamp01((rawT - 0.45) / 0.4);
        const extX = Tx + (Tx - Px) * 0.32;
        const extY = Ty + (Ty - Py) * 0.32;
        drawRulerTool(ctx, Px, Py, extX, extY, 24, rawT < 0.55 ? 0.88 : 0.2, -1);
        drawAnimatedSegment(ctx, Px, Py, extX, extY, pTan, '#16a34a', 2.8);
        drawAnimatedSegment(ctx, Ox, Oy, Tx, Ty, pRad, '#0284c7', 2.2);
        if (rawT > 0.75) {
          const u1x = (Ox - Tx) / R, u1y = (Oy - Ty) / R;
          const lenPT = Math.hypot(Px - Tx, Py - Ty);
          const u2x = (Px - Tx) / lenPT, u2y = (Py - Ty) / lenPT;
          drawRightAngleSymbol(ctx, Tx, Ty, u1x, u1y, u2x, u2y, 12, '#dc2626');
        }
        drawPointWithLabel(ctx, Tx, Ty, 'T', '#dc2626', -8, -12, 1);
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 6: VẼ HAI TIẾP TUYẾN CẮT NHAU TỪ 1 ĐIỂM ĐẾN ĐƯỜNG TRÒN
    // ------------------------------------------------------------------------
    if (tutorialId === 'two-tangents') {
      const Ox = 210, Oy = 185, R = 82;
      const Px = 460, Py = 185;
      const Mx = (Ox + Px) / 2, My = (Oy + Py) / 2;
      const RM = (Px - Ox) / 2;
      const alpha = Math.acos(R / (2 * RM));
      const T1x = Ox + R * Math.cos(-alpha), T1y = Oy + R * Math.sin(-alpha);
      const T2x = Ox + R * Math.cos(alpha), T2y = Oy + R * Math.sin(alpha);

      drawAnimatedArc(ctx, Ox, Oy, R, 0, Math.PI * 2, 1, '#1e293b', 2.4);
      drawPointWithLabel(ctx, Ox, Oy, 'O', '#1e293b', -18, 5, 1);
      drawPointWithLabel(ctx, Px, Py, 'P', '#184e3a', 10, 5, 1);

      const pOP = stepIdx === 0 ? clamp01(rawT * 1.5) : 1;
      drawAnimatedSegment(ctx, Ox, Oy, Px, Py, pOP, '#64748b', 1.8, [5, 4]);
      if (stepIdx > 0 || rawT > 0.55) {
        drawPointWithLabel(ctx, Mx, My, 'M', '#b45309', -6, 20, 1);
      }

      if (stepIdx >= 1) {
        const pArcM = stepIdx === 1 ? clamp01((rawT - 0.08) / 0.78) : 1;
        const tipM = drawAnimatedArc(ctx, Mx, My, RM, -Math.PI, Math.PI, pArcM, '#d97706', 1.7, [5, 4]);
        if (stepIdx === 1) {
          drawCompassTool(ctx, Mx, My, tipM.x, tipM.y, rawT < 0.9 ? 1 : 0.2);
        }
        if (stepIdx > 1 || rawT > 0.35) drawPointWithLabel(ctx, T1x, T1y, 'T₁', '#dc2626', -8, -12, 1);
        if (stepIdx > 1 || rawT > 0.75) drawPointWithLabel(ctx, T2x, T2y, 'T₂', '#dc2626', -8, 22, 1);
      }

      if (stepIdx >= 2) {
        const p1 = stepIdx === 2 ? clamp01(rawT / 0.45) : 1;
        const p2 = stepIdx === 2 ? clamp01((rawT - 0.45) / 0.45) : 1;
        const ext1x = T1x + (T1x - Px) * 0.28, ext1y = T1y + (T1y - Py) * 0.28;
        const ext2x = T2x + (T2x - Px) * 0.28, ext2y = T2y + (T2y - Py) * 0.28;
        drawAnimatedSegment(ctx, Px, Py, ext1x, ext1y, p1, '#16a34a', 2.7);
        drawAnimatedSegment(ctx, Px, Py, ext2x, ext2y, p2, '#16a34a', 2.7);
        drawPointWithLabel(ctx, T1x, T1y, 'T₁', '#dc2626', -8, -12, 1);
        drawPointWithLabel(ctx, T2x, T2y, 'T₂', '#dc2626', -8, 22, 1);
      }

      if (stepIdx >= 3) {
        const pRad = clamp01(rawT / 0.65);
        drawAnimatedSegment(ctx, Ox, Oy, T1x, T1y, pRad, '#0284c7', 2.2);
        drawAnimatedSegment(ctx, Ox, Oy, T2x, T2y, pRad, '#0284c7', 2.2);
        if (rawT > 0.65) {
          const lenPT = Math.hypot(Px - T1x, Py - T1y);
          drawRightAngleSymbol(ctx, T1x, T1y, (Ox - T1x) / R, (Oy - T1y) / R, (Px - T1x) / lenPT, (Py - T1y) / lenPT, 11, '#dc2626');
          drawRightAngleSymbol(ctx, T2x, T2y, (Ox - T2x) / R, (Oy - T2y) / R, (Px - T2x) / lenPT, (Py - T2y) / lenPT, 11, '#dc2626');
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 7: VẼ ĐƯỜNG TRUNG TRỰC CỦA ĐOẠN THẲNG BẰNG COMPA & THƯỚC
    // ------------------------------------------------------------------------
    if (tutorialId === 'perp-bisector') {
      const Ax = 195, Ay = 185, Bx = 425, By = 185;
      const Mx = (Ax + Bx) / 2, My = 185;
      const R = 152;
      const dx = (Bx - Ax) / 2;
      const dy = Math.sqrt(R * R - dx * dx);
      const Px = Mx, Py = My - dy;
      const Qx = Mx, Qy = My + dy;

      const pAB = stepIdx === 0 ? clamp01(rawT * 1.5) : 1;
      drawAnimatedSegment(ctx, Ax, Ay, Bx, By, pAB, '#1e293b', 2.8);
      drawPointWithLabel(ctx, Ax, Ay, 'A', '#1e293b', -20, 6, 1);
      if (pAB > 0.8) drawPointWithLabel(ctx, Bx, By, 'B', '#1e293b', 10, 6, 1);

      if (stepIdx >= 1) {
        const pArcA = stepIdx === 1 ? clamp01((rawT - 0.1) / 0.78) : 1;
        const tipA = drawAnimatedArc(ctx, Ax, Ay, R, -1.05, 1.05, pArcA, '#d97706', 1.8, [5, 4]);
        if (stepIdx === 1) drawCompassTool(ctx, Ax, Ay, tipA.x, tipA.y, rawT < 0.9 ? 1 : 0.2);
      }

      if (stepIdx >= 2) {
        const pArcB = stepIdx === 2 ? clamp01((rawT - 0.1) / 0.78) : 1;
        const tipB = drawAnimatedArc(ctx, Bx, By, R, Math.PI + 1.05, Math.PI - 1.05, pArcB, '#0284c7', 1.8, [5, 4]);
        if (stepIdx === 2) drawCompassTool(ctx, Bx, By, tipB.x, tipB.y, rawT < 0.9 ? 1 : 0.2);
        if (stepIdx > 2 || rawT > 0.4) drawPointWithLabel(ctx, Px, Py, 'P', '#0284c7', 10, -4, 1);
        if (stepIdx > 2 || rawT > 0.8) drawPointWithLabel(ctx, Qx, Qy, 'Q', '#0284c7', 10, 14, 1);
      }

      if (stepIdx >= 3) {
        const pLine = clamp01((rawT - 0.1) / 0.68);
        drawRulerTool(ctx, Px, Py - 15, Qx, Qy + 15, 25, rawT < 0.85 ? 0.88 : 0.2, 1);
        drawAnimatedSegment(ctx, Px, Py - 15, Qx, Qy + 15, pLine, '#16a34a', 2.8);
        if (rawT > 0.6) {
          drawRightAngleSymbol(ctx, Mx, My, 1, 0, 0, -1, 12, '#dc2626');
          drawPointWithLabel(ctx, Mx, My, 'M', '#dc2626', -18, -10, 1);
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 8: VẼ ĐƯỜNG THẲNG SONG SONG QUA 1 ĐIỂM BẰNG Ê-KE & THƯỚC
    // ------------------------------------------------------------------------
    if (tutorialId === 'parallel-line') {
      const yBase = 235;
      const Mx = 310, My = 120;

      drawAnimatedSegment(ctx, 110, yBase, w - 110, yBase, 1, '#1e293b', 2.6);
      drawPointWithLabel(ctx, Mx, My, 'M', '#184e3a', 8, -10, 1);

      if (stepIdx === 1) {
        const appear = clamp01(rawT * 1.6);
        drawRulerTool(ctx, 185, 65, 185, 290, 26, appear, 1);
        drawSetSquareTool(ctx, 185, yBase, 0, 150, 95, appear);
      } else if (stepIdx >= 2) {
        const slideT = easeInOutCubic(clamp01(rawT / 0.55));
        const curY = yBase + (My - yBase) * slideT;
        drawRulerTool(ctx, 185, 65, 185, 290, 26, rawT < 0.9 ? 0.9 : 0.3, 1);
        drawSetSquareTool(ctx, 185, curY, 0, 150, 95, rawT < 0.9 ? 0.9 : 0.3);
        const pPar = clamp01((rawT - 0.55) / 0.4);
        const tip = drawAnimatedSegment(ctx, 110, My, w - 110, My, pPar, '#16a34a', 2.8);
        if (pPar > 0 && pPar < 1) drawPencilTip(ctx, tip.x, tip.y, 1);
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 9: VẼ ĐƯỜNG TRÒN NGOẠI TIẾP TAM GIÁC
    // ------------------------------------------------------------------------
    if (tutorialId === 'circumcircle-triangle') {
      const Ox = 310, Oy = 185, R = 108;
      const Ax = Ox + R * Math.cos(-1.75), Ay = Oy + R * Math.sin(-1.75);
      const Bx = Ox + R * Math.cos(2.45), By = Oy + R * Math.sin(2.45);
      const Cx = Ox + R * Math.cos(0.45), Cy = Oy + R * Math.sin(0.45);

      drawAnimatedSegment(ctx, Ax, Ay, Bx, By, 1, '#1e293b', 2.4);
      drawAnimatedSegment(ctx, Bx, By, Cx, Cy, 1, '#1e293b', 2.4);
      drawAnimatedSegment(ctx, Cx, Cy, Ax, Ay, 1, '#1e293b', 2.4);
      drawPointWithLabel(ctx, Ax, Ay, 'A', '#1e293b', -6, -10, 1);
      drawPointWithLabel(ctx, Bx, By, 'B', '#1e293b', -20, 14, 1);
      drawPointWithLabel(ctx, Cx, Cy, 'C', '#1e293b', 10, 14, 1);

      if (stepIdx >= 1) {
        const mABx = (Ax + Bx) / 2, mABy = (Ay + By) / 2;
        const ux = Ox - mABx, uy = Oy - mABy;
        const p1 = stepIdx === 1 ? clamp01(rawT * 1.4) : 1;
        drawAnimatedSegment(ctx, mABx - ux * 0.7, mABy - uy * 0.7, mABx + ux * 1.8, mABy + uy * 1.8, p1, '#d97706', 1.7, [5, 4]);
      }

      if (stepIdx >= 2) {
        const mBCx = (Bx + Cx) / 2, mBCy = (By + Cy) / 2;
        const ux = Ox - mBCx, uy = Oy - mBCy;
        const p2 = stepIdx === 2 ? clamp01(rawT * 1.4) : 1;
        drawAnimatedSegment(ctx, mBCx - ux * 0.7, mBCy - uy * 0.7, mBCx + ux * 1.9, mBCy + uy * 1.9, p2, '#0284c7', 1.7, [5, 4]);
        if (stepIdx > 2 || rawT > 0.6) {
          drawPointWithLabel(ctx, Ox, Oy, 'O', '#dc2626', 8, -8, 1);
        }
      }

      if (stepIdx >= 3) {
        const pCirc = clamp01((rawT - 0.1) / 0.8);
        const tip = drawAnimatedArc(ctx, Ox, Oy, R, -1.75, -1.75 + Math.PI * 2, pCirc, '#16a34a', 2.6);
        if (rawT < 0.92) drawCompassTool(ctx, Ox, Oy, tip.x, tip.y, 1);
      }
      return;
    }

    // ------------------------------------------------------------------------
    // BÀI 10: VẼ ĐƯỜNG TRÒN NỘI TIẾP TAM GIÁC
    // ------------------------------------------------------------------------
    if (tutorialId === 'incircle-triangle') {
      const Ax = 290, Ay = 52;
      const Bx = 145, By = 260;
      const Cx = 475, Cy = 260;

      const sideA = Math.hypot(Cx - Bx, Cy - By);
      const sideB = Math.hypot(Cx - Ax, Cy - Ay);
      const sideC = Math.hypot(Bx - Ax, By - Ay);
      const perim = sideA + sideB + sideC;
      const Ix = (sideA * Ax + sideB * Bx + sideC * Cx) / perim;
      const Iy = (sideA * Ay + sideB * By + sideC * Cy) / perim;
      const Hx = Ix, Hy = By;
      const rIn = Hy - Iy;

      // Vẽ 3 cạnh tam giác ABC
      drawAnimatedSegment(ctx, Ax, Ay, Bx, By, 1, '#1e293b', 2.5);
      drawAnimatedSegment(ctx, Bx, By, Cx, Cy, 1, '#1e293b', 2.5);
      drawAnimatedSegment(ctx, Cx, Cy, Ax, Ay, 1, '#1e293b', 2.5);
      drawPointWithLabel(ctx, Ax, Ay, 'A', '#1e293b', -6, -10, 1);
      drawPointWithLabel(ctx, Bx, By, 'B', '#1e293b', -22, 14, 1);
      drawPointWithLabel(ctx, Cx, Cy, 'C', '#1e293b', 10, 14, 1);

      // Bước 2: Dựng hai tia phân giác của góc B và góc C cắt nhau tại tâm I
      if (stepIdx >= 1) {
        const pBisB = stepIdx === 1 ? clamp01(rawT / 0.45) : 1;
        const pBisC = stepIdx === 1 ? clamp01((rawT - 0.45) / 0.45) : 1;
        const uxB = (Ix - Bx), uyB = (Iy - By);
        const uxC = (Ix - Cx), uyC = (Iy - Cy);
        drawAnimatedSegment(ctx, Bx, By, Bx + uxB * 1.32, By + uyB * 1.32, pBisB, '#d97706', 1.8, [5, 4]);
        drawAnimatedSegment(ctx, Cx, Cy, Cx + uxC * 1.32, Cy + uyC * 1.32, pBisC, '#0284c7', 1.8, [5, 4]);
        if (stepIdx > 1 || rawT > 0.78) {
          drawPointWithLabel(ctx, Ix, Iy, 'I', '#dc2626', 8, -10, 1);
        }
      }

      // Bước 3: Dùng thước ê-ke hạ đường vuông góc IH từ tâm I xuống cạnh BC để tìm bán kính r = IH
      if (stepIdx >= 2) {
        const pRad = stepIdx === 2 ? clamp01((rawT - 0.15) / 0.65) : 1;
        if (stepIdx === 2 && rawT < 0.88) {
          drawSetSquareTool(ctx, Hx, Hy, 0, 95, 95, 0.88);
        }
        const tipH = drawAnimatedSegment(ctx, Ix, Iy, Hx, Hy, pRad, '#dc2626', 2.2, [4, 3]);
        if (stepIdx === 2 && pRad > 0 && pRad < 1) {
          drawPencilTip(ctx, tipH.x, tipH.y, 1);
        }
        if (stepIdx > 2 || rawT > 0.65) {
          drawRightAngleSymbol(ctx, Hx, Hy, 1, 0, 0, -1, 11, '#dc2626');
          drawPointWithLabel(ctx, Hx, Hy, 'H', '#dc2626', -6, 20, 1);
        }
      }

      // Bước 4: Đặt compa tại tâm I, mở bán kính IH và quay đường tròn nội tiếp tiếp xúc cả 3 cạnh
      if (stepIdx >= 3) {
        const pCirc = clamp01((rawT - 0.08) / 0.82);
        const tip = drawAnimatedArc(ctx, Ix, Iy, rIn, Math.PI / 2, Math.PI / 2 + Math.PI * 2, pCirc, '#16a34a', 2.7);
        if (rawT < 0.92) {
          drawCompassTool(ctx, Ix, Iy, tip.x, tip.y, 1);
        }
      }
      return;
    }
  }

  // ==========================================================================
  // 4. ĐIỀU KHIỂN TRÌNH PHÁT VIDEO & ĐỒNG BỘ GIAO DIỆN
  // ==========================================================================
  function getCurrentTutorial() {
    return TUTORIALS[playerState.currentTutorialIndex] || TUTORIALS[0];
  }

  function getCurrentStep() {
    const tut = getCurrentTutorial();
    return (tut && tut.steps[playerState.currentStepIndex]) || tut.steps[0];
  }

  function updateModalUI() {
    const tut = getCurrentTutorial();
    const step = getCurrentStep();
    if (!tut || !step) return;

    const titleEl = document.getElementById('tutorial-modal-title');
    const badgeEl = document.getElementById('tutorial-modal-badge');
    const stepTitleEl = document.getElementById('tutorial-step-title');
    const subtitleEl = document.getElementById('tutorial-voice-subtitle');
    const playBtnEl = document.getElementById('btn-tutorial-play-pause');
    const voiceBtnEl = document.getElementById('btn-tutorial-voice-toggle');
    const stepsPillsEl = document.getElementById('tutorial-steps-pills');
    const sidebarListEl = document.getElementById('tutorial-sidebar-list');
    const altBtnEl = document.getElementById('btn-tutorial-alt-method');

    if (titleEl) titleEl.textContent = `${tut.number}. ${tut.title}`;
    if (badgeEl) badgeEl.textContent = tut.category;
    if (stepTitleEl) stepTitleEl.textContent = step.title;
    if (subtitleEl) subtitleEl.textContent = `🗣️ "${step.voice}"`;
    if (playBtnEl) {
      playBtnEl.innerHTML = playerState.isPlaying ? '⏸ Tạm dừng' : '▶ Phát tiếp';
    }
    if (voiceBtnEl) {
      voiceBtnEl.innerHTML = playerState.voiceEnabled ? '🔊 Lời nói: Bật' : '🔇 Lời nói: Tắt';
      voiceBtnEl.classList.toggle('active', playerState.voiceEnabled);
    }

    if (altBtnEl) {
      if (tut.altTutorialId && tut.altTutorialLabel) {
        altBtnEl.style.display = 'inline-flex';
        altBtnEl.textContent = tut.altTutorialLabel;
        altBtnEl.onclick = () => openTutorialById(tut.altTutorialId);
      } else {
        altBtnEl.style.display = 'none';
      }
    }

    if (stepsPillsEl) {
      stepsPillsEl.innerHTML = '';
      tut.steps.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tutorial-step-pill' + (idx === playerState.currentStepIndex ? ' active' : (idx < playerState.currentStepIndex ? ' done' : ''));
        btn.textContent = `Bước ${idx + 1}`;
        btn.addEventListener('click', () => {
          jumpToStep(idx, true);
        });
        stepsPillsEl.appendChild(btn);
      });
    }

    if (sidebarListEl) {
      const items = sidebarListEl.querySelectorAll('.tutorial-Topic-btn');
      items.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === playerState.currentTutorialIndex);
      });
    }
  }

  function renderCurrentFrame() {
    const canvasEl = document.getElementById('tutorial-video-canvas');
    if (!canvasEl) return;
    const c = canvasEl.getContext('2d');
    if (!c) return;
    const tut = getCurrentTutorial();
    const w = canvasEl.width || 620;
    const h = canvasEl.height || 330;
    renderScene(c, w, h, tut.id, playerState.currentStepIndex, playerState.stepProgress);

    const progressBar = document.getElementById('tutorial-progress-fill');
    if (progressBar && tut && tut.steps.length > 0) {
      const totalPct = ((playerState.currentStepIndex + clamp01(playerState.stepProgress)) / tut.steps.length) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, totalPct)).toFixed(1)}%`;
    }
  }

  function speakCurrentStepIfNeeded() {
    const tut = getCurrentTutorial();
    const step = getCurrentStep();
    if (!tut || !step) return;
    const key = `${tut.id}_${playerState.currentStepIndex}`;
    if (playerState.spokenStepKey !== key) {
      playerState.spokenStepKey = key;
      if (playerState.isPlaying && playerState.voiceEnabled) {
        speakStepText(step.ttsText || step.voice);
      }
    }
  }

  function animationTick(now) {
    if (!playerState.isOpen || !playerState.isPlaying) return;
    const curNow = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (!playerState.lastFrameTime) playerState.lastFrameTime = curNow;
    const dt = Math.min(100, Math.max(0, curNow - playerState.lastFrameTime));
    playerState.lastFrameTime = curNow;

    const tut = getCurrentTutorial();
    const step = getCurrentStep();
    const stepDuration = ((step && step.duration) || 5500) / playerState.playbackSpeed;

    playerState.stepProgress = Math.min(1, playerState.stepProgress + dt / stepDuration);
    renderCurrentFrame();

    // Chỉ chuyển sang bước tiếp theo khi CẢ hoạt ảnh đã vẽ xong (stepProgress >= 1)
    // VÀ giọng đọc đã nói hết câu tự nhiên (+ nghỉ lấy hơi 550ms) để không bao giờ ngắt lời giữa chừng!
    if (playerState.stepProgress >= 1) {
      const voiceDone = !playerState.voiceEnabled || (!playerState.isSpeaking && (curNow - (playerState.speechFinishedAt || 0) >= 550));
      if (voiceDone) {
        if (playerState.currentStepIndex < tut.steps.length - 1) {
          playerState.currentStepIndex++;
          playerState.stepProgress = 0;
          updateModalUI();
          speakCurrentStepIfNeeded();
        } else {
          playerState.stepProgress = 1;
          playerState.isPlaying = false;
          updateModalUI();
          renderCurrentFrame();
          return;
        }
      }
    }

    if (playerState.isPlaying && typeof window.requestAnimationFrame === 'function') {
      playerState.rafId = window.requestAnimationFrame(animationTick);
    }
  }

  function startPlayback() {
    const tut = getCurrentTutorial();
    if (playerState.currentStepIndex >= tut.steps.length - 1 && playerState.stepProgress >= 0.99) {
      playerState.currentStepIndex = 0;
      playerState.stepProgress = 0;
      playerState.spokenStepKey = null;
    }
    playerState.isPlaying = true;
    playerState.lastFrameTime = 0;
    updateModalUI();
    speakCurrentStepIfNeeded();
    if (typeof window.requestAnimationFrame === 'function') {
      if (playerState.rafId && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(playerState.rafId);
      }
      playerState.rafId = window.requestAnimationFrame(animationTick);
    } else {
      renderCurrentFrame();
    }
  }

  function pausePlayback() {
    playerState.isPlaying = false;
    stopSpeech();
    if (playerState.rafId && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(playerState.rafId);
      playerState.rafId = null;
    }
    updateModalUI();
  }

  function jumpToStep(stepIdx, autoPlay) {
    const tut = getCurrentTutorial();
    if (!tut) return;
    const clamped = Math.max(0, Math.min(tut.steps.length - 1, stepIdx));
    playerState.currentStepIndex = clamped;
    playerState.stepProgress = 0;
    playerState.spokenStepKey = null;
    playerState.lastFrameTime = 0;
    updateModalUI();
    renderCurrentFrame();
    if (autoPlay) {
      startPlayback();
    }
  }

  function openTutorialById(tutorialId) {
    const idx = TUTORIALS.findIndex(t => t.id === tutorialId);
    playerState.currentTutorialIndex = idx >= 0 ? idx : 0;
    playerState.currentStepIndex = 0;
    playerState.stepProgress = 0;
    playerState.spokenStepKey = null;
    playerState.isOpen = true;

    const modal = document.getElementById('tutorial-video-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
    const menu = document.getElementById('menu-group-tutorials');
    if (menu) {
      menu.classList.remove('open', 'show');
      menu.style.display = 'none';
    }
    const container = document.getElementById('dropdown-geo-tutorials');
    if (container) {
      container.classList.remove('open');
    }

    updateModalUI();
    renderCurrentFrame();
    startPlayback();
  }

  function closeTutorialModal() {
    pausePlayback();
    playerState.isOpen = false;
    const modal = document.getElementById('tutorial-video-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function initTutorialsModule() {
    const sidebarListEl = document.getElementById('tutorial-sidebar-list');

    // Khởi tạo danh sách bài học bên trái modal
    if (sidebarListEl) {
      sidebarListEl.innerHTML = '';
      TUTORIALS.forEach((tut, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tutorial-Topic-btn' + (idx === 0 ? ' active' : '');
        btn.setAttribute('data-tutorial-id', tut.id);
        btn.innerHTML = `
          <span class="tutorial-topic-num">${tut.number}</span>
          <span class="tutorial-topic-text">
            <strong>${tut.title}</strong>
            <small>🔊 ${tut.durationLabel}</small>
          </span>
        `;
        btn.addEventListener('click', () => {
          openTutorialById(tut.id);
        });
        sidebarListEl.appendChild(btn);
      });
    }

    // Các mục trong menu thả xuống Hướng dẫn
    document.querySelectorAll('.tutorial-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = item.getAttribute('data-tutorial-id');
        if (tid) {
          openTutorialById(tid);
        }
      });
    });

    const modalBackdrop = document.getElementById('tutorial-video-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeTutorialModal();
        }
      });
    }

    // Các nút điều khiển trong cửa sổ Video Hướng dẫn
    const btnClose = document.getElementById('btn-close-tutorial-modal');
    if (btnClose) btnClose.addEventListener('click', closeTutorialModal);

    const btnPlayPause = document.getElementById('btn-tutorial-play-pause');
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => {
        if (playerState.isPlaying) pausePlayback();
        else startPlayback();
      });
    }

    const btnPrev = document.getElementById('btn-tutorial-prev-step');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        jumpToStep(playerState.currentStepIndex - 1, true);
      });
    }

    const btnNext = document.getElementById('btn-tutorial-next-step');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        jumpToStep(playerState.currentStepIndex + 1, true);
      });
    }

    const btnReplay = document.getElementById('btn-tutorial-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        jumpToStep(0, true);
      });
    }

    const btnVoice = document.getElementById('btn-tutorial-voice-toggle');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        playerState.voiceEnabled = !playerState.voiceEnabled;
        if (!playerState.voiceEnabled) {
          stopSpeech();
        } else {
          playerState.spokenStepKey = null;
          speakCurrentStepIfNeeded();
        }
        updateModalUI();
      });
    }

    const btnPractice = document.getElementById('btn-tutorial-try-tool');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        const tut = getCurrentTutorial();
        closeTutorialModal();
        if (tut && tut.geoTool && window.__netInternal && typeof window.__netInternal.activateGeoTool === 'function') {
          window.__netInternal.activateGeoTool(tut.geoTool);
        }
      });
    }

    // Nạp và lắng nghe danh sách giọng đọc tiếng Việt chất lượng cao của trình duyệt
    try {
      if ('speechSynthesis' in window && window.speechSynthesis) {
        pickVietnameseVoice();
        if ('onvoiceschanged' in window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => {
            pickVietnameseVoice();
          };
        }
      }
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initTutorialsModule);
  }

  if (typeof window !== 'undefined') {
    window.__NetTutorials = {
      TUTORIALS,
      playerState,
      openTutorialById,
      closeTutorialModal,
      jumpToStep,
      startPlayback,
      pausePlayback,
      renderCurrentFrame,
      speakStepText
    };
  }
})();
