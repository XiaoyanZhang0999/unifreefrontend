import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SignUpForm } from '../SignUpForm';
import { serviceRequest } from '../../../../services/serviceRequest';

jest.mock('../../../../services/serviceRequest');
jest.setTimeout(3000);

describe('SignUpForm Test Suite', () => {
  const successPayload = {
    status: 'success',
    data: {
      email: 'test@test.edu',
      username: 'test',
      token: '123',
      createdAt: new Date().toString(),
    },
  };

  const failPayload = {
    status: 'error',
    data: {
      email: 'test@test.edu',
      username: 'test',
      token: '',
      createdAt: new Date().toString(),
    },
  };

  beforeAll(() => {
    // Silence console.error
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  beforeEach(() => {
    serviceRequest.mockClear();
  });

  it('Should sign up users successfully', async () => {
    serviceRequest.mockImplementation(async () => (successPayload));
    const renderDom = render(<SignUpForm />);
    const { container, baseElement } = renderDom;
    const emailInput = container.querySelectorAll('input')[0];
    const usernameInput = container.querySelectorAll('input')[1];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(emailInput, { target: { value: 'test@test.edu' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword01' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(expect(baseElement.outerHTML).toBe('<body><div></div></body>'));
  });

  it('Should catch error for existing account', async () => {
    const payload = {
      status: 'error',
      message: 'This email or username has already been taken',
    };
    serviceRequest.mockReturnValue(payload);
    const renderDom = render(<SignUpForm />);
    const { container, getByText } = renderDom;
    const emailInput = container.querySelectorAll('input')[0];
    const usernameInput = container.querySelectorAll('input')[1];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(emailInput, { target: { value: 'test@test.edu' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword01' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(getByText('This email or username has already been taken')).toBeInTheDocument();
  });

  it('Should catch error for internal service error', async () => {
    serviceRequest.mockImplementation(async () => { throw new Error('Internal Service Error'); });
    const renderDom = render(<SignUpForm />);
    const { container, getByText } = renderDom;
    const emailInput = container.querySelectorAll('input')[0];
    const usernameInput = container.querySelectorAll('input')[1];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(emailInput, { target: { value: 'test@test.edu' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword01' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(getByText('Internal Service Error')).toBeInTheDocument();
  });

  it('should fail to sign up due to invalid email', async () => {
    serviceRequest.mockReturnValue(failPayload);
    const renderDom = render(<SignUpForm />);
    const { container, getByText } = renderDom;
    const usernameInput = container.querySelectorAll('input')[1];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword01' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(getByText('Invalid email. You must use a college email.')).toBeInTheDocument();
  });

  it('Should fail to sign up due to invalid username', async () => {
    serviceRequest.mockReturnValue(failPayload);
    const renderDom = render(<SignUpForm />);
    const { container, getByText } = renderDom;
    const emailInput = container.querySelectorAll('input')[0];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(emailInput, { target: { value: 'test@test.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword01' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(getByText('Invalid username')).toBeInTheDocument();
  });

  it('Should fail to sign up due to invalid password', async () => {
    serviceRequest.mockReturnValue(failPayload);
    const renderDom = render(<SignUpForm />);
    const { container, getByText } = renderDom;
    const emailInput = container.querySelectorAll('input')[0];
    const usernameInput = container.querySelectorAll('input')[1];
    const passwordInput = container.querySelectorAll('input')[2];
    fireEvent.change(emailInput, { target: { value: 'test@test.edu' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(container.querySelector('button'));
    await new Promise((x) => setTimeout(x, 100));
    expect(getByText('Invalid password')).toBeInTheDocument();
  });
});
