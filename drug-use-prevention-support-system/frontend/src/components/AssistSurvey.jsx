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

const FREQUENCY_OPTIONS = [
  { label: 'Không bao giờ', value: 0 },
  { label: '1 hoặc 2 lần', value: 2 },
  { label: 'Hàng tháng', value: 3 },
  { label: 'Hàng tuần', value: 4 },
  { label: 'Hàng ngày hoặc gần như hàng ngày', value: 6 },
];

const YESNO_OPTIONS = [
  { label: 'Có', value: 1 },
  { label: 'Không', value: 0 },
];

export default function AssistSurvey({ onFinish }) {
  const [step, setStep] = useState(1);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [otherDrug, setOtherDrug] = useState('');
  const [recentDrugs, setRecentDrugs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const navigate = useNavigate();

  // Step 1: Chọn các loại ma túy từng sử dụng
  const handleDrugChange = (checkedValues) => {
    setSelectedDrugs(checkedValues);
  };

  // Step 2: Chọn các loại ma túy đã sử dụng trong 3 tháng gần đây
  const handleRecentDrugChange = (checkedValues) => {
    setRecentDrugs(checkedValues);
  };

  // Step 3: Trả lời câu hỏi cho từng loại ma túy đã sử dụng trong 3 tháng gần đây
  const handleAnswerChange = (drug, qIdx, value) => {
    setAnswers((prev) => ({
      ...prev,
      [drug]: {
        ...prev[drug],
        [qIdx]: value
      }
    }));
  };

  // Tính điểm và phân loại nguy cơ
  const calculateResult = () => {
    let scores = {};
    let maxRisk = 0;
    for (let drug of recentDrugs) {
      let total = 0;
      for (let i = 1; i <= 5; ++i) {
        total += Number(answers[drug]?.[i] || 0);
      }
      scores[drug] = total;
      if (total > maxRisk) {
        maxRisk = total;
      }
    }
    setResult(scores);
    // Phân loại nguy cơ theo hướng dẫn chung (0-3: thấp, 4-26: vừa, 27+: cao)
    let level = 'Nguy cơ thấp';
    let suggestionText = (
      <>
        <b>Bạn nên tham khảo thêm các khóa học phòng ngừa và kỹ năng sống.</b><br/>
        <Button type="link" onClick={() => navigate('/courses')}>Đến trang khóa học</Button>
      </>
    );
    if (maxRisk >= 27) {
      level = 'Nguy cơ cao';
      suggestionText = (
        <>
          <b>Bạn nên liên hệ chuyên gia để được hỗ trợ kịp thời.</b><br/>
          <Button type="link" onClick={() => navigate('/appointments')}>Đặt lịch hẹn tư vấn</Button>
        </>
      );
    } else if (maxRisk >= 4) {
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
    if (onFinish) onFinish(scores);
  };

  // Render các bước khảo sát
  return (
    <Card style={{ maxWidth: 700,  margin: '0 auto' }}>
      <Title level={4}>Khảo sát ASSIST (18+)</Title>
      {step === 1 && (
        <>
          <Paragraph>Câu 1: Trong cuộc đời của bạn, bạn đã từng sử dụng bất kỳ loại ma túy nào sau đây không? (Chọn tất cả những gì bạn đã từng sử dụng. Nếu không có, dừng khảo sát tại đây.)</Paragraph>
          <Checkbox.Group options={DRUGS} value={selectedDrugs} onChange={handleDrugChange} />
          {selectedDrugs.includes('Khác (xin ghi rõ)') && (
            <input type="text" placeholder="Nhập loại khác" value={otherDrug} onChange={e => setOtherDrug(e.target.value)} style={{ marginTop: 8, width: '100%', backgroundColor: '#F0F0F0',color: '#000000' }} />
          )}
          <Button type="primary" style={{ marginTop: 16 }} disabled={selectedDrugs.length === 0} onClick={() => setStep(2)}>Tiếp tục</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Paragraph>Câu 2: Trong 3 tháng gần đây, bạn đã sử dụng bất kỳ loại ma túy nào được liệt kê ở câu 1 không? </Paragraph>
          <Checkbox.Group options={selectedDrugs} value={recentDrugs} onChange={handleRecentDrugChange} />
          <Button style={{ marginTop: 16, marginRight: 8 }} onClick={() => setStep(1)}>Quay lại</Button>
          <Button type="primary" style={{ marginTop: 16 }} onClick={() => setStep(3)} disabled={recentDrugs.length === 0}>Tiếp tục</Button>
        </>
      )}
      {step === 3 && recentDrugs.length > 0 && (
        <>
          <Paragraph>Phần 2: Mức độ sử dụng và hậu quả (trong 3 tháng gần đây, cho từng loại đã chọn)</Paragraph>
          {recentDrugs.map(drug => (
            <Card key={drug} style={{ marginBottom: 16,  maxWidth: 1400, width: '100%' }}>
              <Title level={5}>{drug}</Title>
              {[1,2,3,4,5].map(qIdx => (
                <div key={qIdx} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 500, marginBottom: 6, whiteSpace: 'normal', fontSize: 16 }}>
                    {`Q${qIdx}: ${[
                      `Bạn đã sử dụng ${drug} bao nhiêu lần?`,
                      `Bạn có cảm thấy thèm muốn hoặc khao khát mạnh mẽ muốn sử dụng ${drug} không?`,
                      `Việc sử dụng ${drug} có dẫn đến bất kỳ vấn đề nào về sức khỏe (thể chất hoặc tinh thần) cho bạn không?`,
                      `Việc sử dụng ${drug} có gây ra bất kỳ vấn đề nào về xã hội, pháp lý hoặc tài chính cho bạn không?`,
                      `Bạn có bỏ lỡ hoặc lơ là bất kỳ trách nhiệm quan trọng nào do sử dụng ${drug} không?`
                    ][qIdx-1]}`}
                  </div>
                  <Radio.Group
                    options={FREQUENCY_OPTIONS}
                    value={answers[drug]?.[qIdx]}
                    onChange={e => handleAnswerChange(drug, qIdx, e.target.value)}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
                  />
                </div>
              ))}
            </Card>
          ))}
          <Button style={{ marginTop: 16, marginRight: 8 }} onClick={() => setStep(2)}>Quay lại</Button>
          <Button type="primary" style={{ marginTop: 16 }} onClick={calculateResult}>Xem kết quả</Button>
        </>
      )}
      {result && (
        <Alert
          message={
            <>
              Kết quả khảo sát<br/>
              <b>Phân loại: {riskLevel}</b>
            </>
          }
          description={
            <>
              {Object.entries(result).map(([drug, score]) => (
                <div key={drug}>{drug}: {score} điểm</div>
              ))}
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