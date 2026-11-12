export default function FormField({ formik, name, label, ...props }) {
  const invalid = Boolean(formik.touched[name] && formik.errors[name])
  return <div className="mb-3">
    <label className="form-label" htmlFor={name}>{label}</label>
    <input {...props} {...formik.getFieldProps(name)} id={name}
      className={`form-control${invalid ? ' is-invalid' : ''}`}
      aria-invalid={invalid} aria-describedby={invalid ? `${name}-error` : undefined} />
    {invalid && <div id={`${name}-error`} className="invalid-feedback">{formik.errors[name]}</div>}
  </div>
}
