import React, { useState } from 'react';
import { Card, Typography, Checkbox, Button, Form, Radio, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Paragraph } = Typography;

const DRUGS = [
  'Cần sa (bồ đà, cỏ, v.v.)',
  'Cocaine (coke, crack, v.v.)',
  'Ma túy đá (methamphetamine, đá, hàng đá, crystal meth)',
  'Thuốc lắc (MDMA, ecstasy, kẹo)',
  'Heroin (thuốc phiện, morphi, v.v.)',
  'Ketamine (Ke, K)',
  'Chất hít (keo, sơn, xăng, khí cười, v.v.)',
  'Thuốc an thần, thuốc ngủ (ví dụ: Xanax, Valium) được sử dụng không có chỉ định của bác sĩ',
  'Thuốc giảm đau opioid (ví dụ: Oxycodone, Codeine, Tramadol) được sử dụng không có chỉ định của bác sĩ',
  'Chất gây ảo giác (LSD, nấm, v.v.)',
  '"Nước vui", "Bóng cười" (lạm dụng Nitrous Oxide), hoặc các loại ma túy tổng hợp mới khác',
  'Khác (xin ghi rõ)' // sẽ có input text
];

const YESNO_OPTIONS = [
  { label: 'Có', value: 1 },
  { label: 'Không', value: 0 },
];

const CRAFFT_QUESTIONS = [
  'Car: Bạn đã từng đi xe (là hành khách hoặc người lái) do ai đó (kể cả bạn) đang "phê" (high) hoặc đã sử dụng rượu hoặc ma túy lái chưa?',
  'Relax: Bạn có bao giờ dùng rượu hoặc ma túy để thư giãn, cảm thấy tốt hơn về bản thân hoặc hòa nhập không?',
  'Alone: Bạn có bao giờ dùng rượu hoặc ma túy khi bạn ở một mình không?',
  'Forget: Bạn có bao giờ quên những gì mình đã làm khi dùng rượu hoặc ma túy không?',
  'Family/Friends: Gia đình hoặc bạn bè của bạn có bao giờ nói rằng bạn nên giảm uống rượu hoặc dùng ma túy không?',
  'Trouble: Bạn có bao giờ gặp rắc rối khi dùng rượu hoặc ma túy không? (Ví dụ: bị bắt, cãi nhau, làm hỏng đồ đạc, bị đuổi học, v.v.)',
];

export default function CrafftSurvey({ onFinish }) {
  const [step, setStep] = useState(1);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [otherDrug, setOtherDrug] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const navigate = useNavigate();

  // Step 1: Chọn các loại ma túy từng sử dụng
  const handleDrugChange = (checkedValues) => {
    setSelectedDrugs(checkedValues);
  };

  // Step 2: Trả lời các câu hỏi CRAFFT (giả lập, ví dụ 6 câu)
  const handleAnswerChange = (qIdx, value) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: value }));
  };

  // Tính điểm và phân loại nguy cơ
  const calculateResult = () => {
    let total = 0;
    for (let i = 1; i <= 6; ++i) {
      total += Number(answers[i] || 0);
    }
    setResult(total);
    // Phân loại nguy cơ CRAFFT (0-1: thấp, 2-4: vừa, 5-6: cao)
    let level = 'Nguy cơ thấp';
    let suggestionText = (
      <>
        <b>Bạn nên tham khảo thêm các khóa học phòng ngừa và kỹ năng sống.</b><br/>
        <Button type="link" onClick={() => navigate('/courses')}>Đến trang khóa học</Button>
      </>
    );
    if (total >= 5) {
      level = 'Nguy cơ cao';
      suggestionText = (
        <>
          <b>Bạn nên liên hệ chuyên gia để được hỗ trợ kịp thời.</b><br/>
          <Button type="link" onClick={() => navigate('/appointments')}>Đặt lịch hẹn tư vấn</Button>
        </>
      );
    } else if (total >= 2) {
      level = 'Nguy cơ vừa';
      suggestionText = (
        <>
          <b>Bạn nên tham khảo thêm các khóa học phòng ngừa và kỹ năng sống.</b><br/>
          <Button type="link" onClick={() => navigate('/courses')}>Đến trang khóa học</Button>
        </>
      );
    }
    setRiskLevel(level);
    setSuggestion(suggestionText);
    if (onFinish) onFinish(total);
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={4}>Khảo sát CRAFFT (12-17 tuổi)</Title>
      {step === 1 && (
        <>
          <Paragraph>Phần 1: Trong cuộc đời của bạn, bạn đã từng sử dụng bất kỳ loại ma túy nào sau đây không? (Chọn tất cả những gì bạn đã từng sử dụng. Nếu không có, dừng khảo sát tại đây.)</Paragraph>
          <Checkbox.Group options={DRUGS} value={selectedDrugs} onChange={handleDrugChange} />
          {selectedDrugs.includes('Khác (xin ghi rõ)') && (
            <input type="text" placeholder="Nhập loại khác" value={otherDrug} onChange={e => setOtherDrug(e.target.value)} style={{ marginTop: 8, width: '100%' }} />
          )}
          <Button type="primary" style={{ marginTop: 16 }} disabled={selectedDrugs.length === 0} onClick={() => setStep(2)}>Tiếp tục</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Paragraph>Phần 2: Các câu hỏi sàng lọc CRAFFT (6 câu hỏi, Có/Không)</Paragraph>
          {CRAFFT_QUESTIONS.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 500, marginBottom: 6, whiteSpace: 'normal', fontSize: 16 }}>
                {`Câu hỏi ${idx+1}: ${q}`}
              </div>
              <Radio.Group
                options={YESNO_OPTIONS}
                value={answers[idx+1]}
                onChange={e => handleAnswerChange(idx+1, e.target.value)}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
              />
            </div>
          ))}
          <Button style={{ marginTop: 16, marginRight: 8 }} onClick={() => setStep(1)}>Quay lại</Button>
          <Button type="primary" style={{ marginTop: 16 }} onClick={calculateResult}>Xem kết quả</Button>
        </>
      )}
      {result !== null && (
        <Alert
          message={
            <>
              Kết quả khảo sát<br/>
              <b>Phân loại: {riskLevel}</b>
            </>
          }
          description={
            <>
              Tổng điểm: {result}
              <div style={{marginTop: 12}}>{suggestion}</div>
            </>
          }
          type={riskLevel === 'Nguy cơ cao' ? 'error' : (riskLevel === 'Nguy cơ vừa' ? 'warning' : 'success')}
          showIcon
          style={{ marginTop: 24 }}
        />
      )}
    </Card>
  );
} 