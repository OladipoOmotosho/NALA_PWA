// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FieldReferenceHelper } from './FieldReferenceHelper';

describe('FieldReferenceHelper (read-only Taxonomy guidance)', () => {
  it('is collapsed by default and reveals the cascade on toggle', async () => {
    const user = userEvent.setup();
    render(<FieldReferenceHelper />);
    expect(screen.queryByLabelText('Category')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /need help identifying this/i }));
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('walks the cascade to a leaf and shows suggested Focus Area + Mechanisms, never a form field', async () => {
    const user = userEvent.setup();
    render(<FieldReferenceHelper />);
    await user.click(screen.getByRole('button', { name: /need help identifying this/i }));

    await user.selectOptions(screen.getByLabelText('Category'), 'Process Equipment (Mechanical)');
    await user.selectOptions(screen.getByLabelText('Equipment Type'), 'Influent Screen / Bar Rack');
    await user.selectOptions(screen.getByLabelText('Component'), 'Screen Assembly');
    await user.selectOptions(screen.getByLabelText('Subcomponent'), 'Bar Rack / Mesh Panel');

    expect(
      screen.getByText('Section loss, blinding/plugging, distortion of bars from grit and debris loading'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Corrosion & Material Loss/)).toBeInTheDocument();
    expect(screen.getByText(/Flow-Induced Damage/)).toBeInTheDocument();

    // guidance only — this panel has no writable Submission field, by construction
    expect(screen.queryByLabelText('Deficiency Category')).not.toBeInTheDocument();
  });

  it('resets dependent selects when an upstream level changes', async () => {
    const user = userEvent.setup();
    render(<FieldReferenceHelper />);
    await user.click(screen.getByRole('button', { name: /need help identifying this/i }));

    await user.selectOptions(screen.getByLabelText('Category'), 'Process Equipment (Mechanical)');
    await user.selectOptions(screen.getByLabelText('Equipment Type'), 'Influent Screen / Bar Rack');
    await user.selectOptions(screen.getByLabelText('Component'), 'Screen Assembly');

    await user.selectOptions(screen.getByLabelText('Category'), 'Building Envelope');
    expect((screen.getByLabelText('Equipment Type') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Component') as HTMLSelectElement).value).toBe('');
  });
});
