<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class NewEnrollmentRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize()
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules()
  {
    return [
      'member_id' => 'required',
      'birthdate' => 'required',
    ];
  }
}
