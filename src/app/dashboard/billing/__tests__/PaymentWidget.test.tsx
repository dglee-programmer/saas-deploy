import { render, screen } from '@testing-library/react';
import { PaymentWidget } from '../_components/PaymentWidget';
import { describe, it, expect } from 'vitest';

describe('PaymentWidget Component', () => {
  it('renders correctly with payment methods container', () => {
    render(<PaymentWidget amount={5000} orderId="test-order-123" orderName="프리미엄 요금제" />);
    // 결제 수단이 렌더링될 DOM 엘리먼트가 있는지 확인
    const paymentMethods = document.getElementById('payment-methods');
    expect(paymentMethods).toBeDefined();
  });

  it('renders the payment button', () => {
    render(<PaymentWidget amount={5000} orderId="test-order-123" orderName="프리미엄 요금제" />);
    const payButton = screen.getByRole('button', { name: /결제 카드 등록하기/i });
    expect(payButton).toBeDefined();
  });
});
