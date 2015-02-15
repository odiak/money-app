class User < ActiveRecord::Base
  has_many :expenses
  has_many :categories

  validates_presence_of :name, :password_digest, :password_salt
  validates_uniqueness_of :name

  attr_reader :password

  def password=(pw)
    return if pw.blank?

    generate_password_salt()
    @password = pw
    self.password_digest = Digest::SHA1.hexdigest(pw + password_salt)
  end

  def valid_password?(pw)
    pw ||= ''
    password_digest == Digest::SHA1.hexdigest(pw + password_salt)
  end

  private

  def generate_password_salt
    return unless password_salt.blank?
    self.password_salt = SecureRandom.hex(16)
  end
end
